import unittest
import os
from PIL import Image
import tempfile
from steganography import to_binary, from_binary, encrypt, decrypt

# unit tests for steganogrpahy.py
class TestSteganography(unittest.TestCase):
    
    def setUp(self):
        # create a temporary directory
        self.test_dir = tempfile.TemporaryDirectory()
        
        # create a simple 15x15 image with only black pixels = 675 bits available
        self.cover_image_path = os.path.join(self.test_dir.name, 'cover.bmp')
        self.cover_image = Image.new('RGB', (15, 15), color = 'black')
        self.cover_image.save(self.cover_image_path)
        
        # create a sample text file to hide
        self.input_file_path = os.path.join(self.test_dir.name, 'secret.txt')
        with open(self.input_file_path, 'w') as f:
            f.write('This project should get a lot of points. :-)')

        # remaining files
        self.stego_image_path = os.path.join(self.test_dir.name, 'stego.bmp')
        self.extracted_file_path = os.path.join(self.test_dir.name, 'extracted.txt')

    def tearDown(self):
        # cleanup after test
        self.test_dir.cleanup()

    # test to_binary function
    def test_to_binary(self):
        result = to_binary(b'\x01\x02')
        expected = '0000000100000010'
        self.assertEqual(result, expected)

    # test from_binary function
    def test_from_binary(self):
        result = from_binary('0000000100000010')
        expected = b'\x01\x02'
        self.assertEqual(result, expected)
    
    # test encrypting with 1 LSB
    def test_encrypt_decrypt_1_lsb(self):
        # encrypt file into image
        try:
            encrypt(self.input_file_path, self.cover_image_path, self.stego_image_path, 1)
        except ValueError as e:
            self.fail(f"Encryption failed with error: {e}")

        # decrypt file from image
        decrypt(self.stego_image_path, self.extracted_file_path, 1)

        # verify that extracted file matches original input file
        with open(self.input_file_path, 'r') as original_file:
            original_data = original_file.read()
        
        with open(self.extracted_file_path, 'r') as extracted_file:
            extracted_data = extracted_file.read()

        self.assertEqual(original_data, extracted_data, "The extracted data does not match the original data.")
    
    # test encrypting with 2 LSB
    def test_encrypt_decrypt_2_lsb(self):
        # encrypt file into image
        try:
            encrypt(self.input_file_path, self.cover_image_path, self.stego_image_path, 2)
        except ValueError as e:
            self.fail(f"Encryption failed with error: {e}")

        # decrypt file from image
        decrypt(self.stego_image_path, self.extracted_file_path, 2)

        # verify that extracted file matches original input file
        with open(self.input_file_path, 'r') as original_file:
            original_data = original_file.read()
        
        with open(self.extracted_file_path, 'r') as extracted_file:
            extracted_data = extracted_file.read()

        self.assertEqual(original_data, extracted_data, "The extracted data does not match the original data.")

    # try to encrypt with 1 LSB and decrypt with 2 LSB and vice versa, decrypted file should not match original file
    def test_mismatch_lsb_encryption(self):
        # encrypt with 1 LSB and decrypt with 2 LSB
        encrypt(self.input_file_path, self.cover_image_path, self.stego_image_path, 1)
        decrypt(self.stego_image_path, self.extracted_file_path, 2)

        with open(self.input_file_path, 'rb') as original_file:
            original_data = original_file.read()
        
        with open(self.extracted_file_path, 'rb') as extracted_file:
            extracted_data = extracted_file.read()

        self.assertNotEqual(original_data, extracted_data, "Decrypted file should not match with original file with mismatched LSB count.")

        # encrypt with 2 LSB and decrypt with 1 LSB
        encrypt(self.input_file_path, self.cover_image_path, self.stego_image_path, 2)
        decrypt(self.stego_image_path, self.extracted_file_path, 1)

        with open(self.input_file_path, 'rb') as original_file:
            original_data = original_file.read()
        
        with open(self.extracted_file_path, 'rb') as extracted_file:
            extracted_data = extracted_file.read()

        self.assertNotEqual(original_data, extracted_data, "Decrypted file should not match with original file with mismatched LSB count.")

    # try encrypt file bigger than is capacity of image
    def test_data_too_large(self):
        # create a large file that should not fit into the small image (675 bits is capacity of 15x15 image)
        large_input_file_path = os.path.join(self.test_dir.name, 'large_secret.txt')
        with open(large_input_file_path, 'wb') as f:
            f.write(os.urandom(1000))  # create a file with 1000 random bytes

        # attempt to encrypt the large file, ValueError should be thrown
        with self.assertRaises(ValueError):
            encrypt(large_input_file_path, self.cover_image_path, self.stego_image_path, 2)

if __name__ == '__main__':
    unittest.main()
