import argparse
from PIL import Image
import struct

def main():
    # parsing input arguments
    parser = argparse.ArgumentParser(
        description="""
            Implementation of steganography algorithm for ENC-K semestral project by Filip Pospisil (xpospi27).
            This script is using method of Least Significant Bit (LSB) for hiding file inside bitmap image.   
        """)
    subparsers = parser.add_subparsers(dest="mode", required=True, help="Available modes: 'encrypt' or 'decrypt'.")

    # encrypt mode
    encrypt_parser = subparsers.add_parser(
        'encrypt',
        help='Hide a file inside an image using LSB algorithm.'
    )
    encrypt_parser.add_argument(
        '-f', '--file', required=True,
        help='The file to be hidden inside the image.'
    )
    encrypt_parser.add_argument(
        '-i', '--image', required=True,
        help='The bitmap image that will be used as place for hiding input file.'
    )
    encrypt_parser.add_argument(
        '-o', '--output', required=True,
        help='The name of output image file with the hidden data.'
    )
    encrypt_parser.add_argument(
        '-lsb', '--lsb_count', type=int, choices=[1, 2], default=2,
        help='Optional - Number of bits (1 or 2) used for hiding data. Default mode use 2 bits.'
    )

    # decrypt mode
    decrypt_parser = subparsers.add_parser(
        'decrypt',
        help='Extract a hidden file from an image using LSB algorithm.'
    )
    decrypt_parser.add_argument(
        '-f', '--file', required=True,
        help='The bitmap image containing the hidden data.'
    )
    decrypt_parser.add_argument(
        '-o', '--output', required=True,
        help='The name of output file with extracted data.'
    )
    decrypt_parser.add_argument(
        '-lsb', '--lsb_count', type=int, choices=[1, 2], default=2,
        help='Optional - Number of bits (1 or 2) used for hiding data. Default mode use 2 bits.'
    )

    args = parser.parse_args()

    if args.mode == 'encrypt':
        encrypt(args.file, args.image, args.output, args.lsb_count)
    elif args.mode == 'decrypt':
        decrypt(args.file, args.output, args.lsb_count)

# Convert a bytes object to a binary string.
# Arguments:
#   data: The input bytes data to be converted.
# Returns: 
#   str: A string representing the binary equivalent of the input bytes.
def to_binary(data):
    return ''.join([format(i, "08b") for i in data])

# Convert a binary string back to bytes.
# Arguments:
#   binary_data: The input binary string to be converted.
# Returns: 
#   bytes: A bytes object converted from the binary string.
def from_binary(binary_data):
    byte_array = bytearray()
    for i in range(0, len(binary_data), 8):
        byte_array.append(int(binary_data[i:i+8], 2))
    return bytes(byte_array)

# Encrypt input file into bitmap image.
# Arguments:
#   input_file: Path to the input file to hide.
#   input_image: Path to the bitmap image.
#   output_image: Path to save the image with encrypted file inside.
#   lsb_count: Number of least significant bits to use for hiding data.
# Raises: 
#   ValueError: If the input file is too large to be hidden in the cover image.
def encrypt(input_file, input_image, output_image, lsb_count):
    print(f"Encrypting '{input_file}' into '{input_image}' using {lsb_count} bits in LSB algorithm. Output file: '{output_image}'.")   

    with open(input_file, 'rb') as f:
            file_data = f.read()

    binary_data = to_binary(file_data)
    data_length = len(binary_data)
    length_prefix = to_binary(struct.pack('>I', data_length)) # > means Big Endian, I means unsigned integer (4 bytes)
    binary_data = length_prefix + binary_data

    image = Image.open(input_image)
    pixels = list(image.getdata())
    available_bits = len(pixels) * 3 * lsb_count
    required_bits = len(binary_data)

    if required_bits > available_bits:
        raise ValueError(f"Input file is too big and won't fit into image. {required_bits} bits required but only {available_bits} available.")
    
    binary_index = 0 # keep position
    lsb_mask = 0xFF ^ (2**lsb_count - 1)  # mask to clear the LSBs

    # iterate through pixels and hide data inside them
    new_pixels = []
    for pixel in pixels: 
        if binary_index >= len(binary_data): # no more data to hide, add unchanged pixel
            new_pixels.append(pixel)
            continue
        
        new_pixel = []
        for channel in pixel[:3]:
            if binary_index < len(binary_data):
                bits_to_embed = binary_data[binary_index:binary_index + lsb_count]
                new_value = (channel & lsb_mask) | int(bits_to_embed, 2)
                new_pixel.append(new_value)
                binary_index += lsb_count
            else:
                new_pixel.append(channel) # no more data to hide, add unchanged channel

        new_pixel += pixel[3:]  # add remaining channel if used (for example Alpha in RGBA)
        new_pixels.append(tuple(new_pixel))

    # create a new image with the modified pixels
    new_image = Image.new(image.mode, image.size)
    new_image.putdata(new_pixels)
    new_image.save(output_image)

    print(f"Data successfully hidden in {output_image}.")

# Decrypt original file from bitmap image.
# Arguments:
#   input_image: Path to the bitmap image with encrypted file inside.
#   output_image: Path to save the decrypted file.
#   lsb_count: Number of least significant bits to use for hiding data.
def decrypt(input_image, output_file, lsb_count):
    print(f"Decrypting '{input_image}' using {lsb_count} bits in LSB algorithm. Output file: '{output_file}'.")

    image = Image.open(input_image)
    pixels = list(image.getdata())
    
    binary_data = ""

    # iterate through pixels and get encrypted bits
    for pixel in pixels:
        for channel in pixel[:3]:  # RGB channels
            binary_data += format(channel, "08b")[-lsb_count:]

    length_prefix = binary_data[:32] # 4 bytes prefix
    data_length = struct.unpack('>I', from_binary(length_prefix))[0] # > means Big Endian, I means unsigned integer (4 bytes)

    extracted_data = binary_data[32:32 + data_length]
    file_data = from_binary(extracted_data)

    with open(output_file, 'wb') as f:
        f.write(file_data)

    print(f"Data extracted and saved to {output_file}.")

if __name__ == "__main__":
    main()
