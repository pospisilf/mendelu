# ⚠️ **IMPORTANT NOTICE** ⚠️

## You can see this project with English documentation and with the possibility for future updates and improvements in [pospisilf/python-lsb-steganography](https://github.com/pospisilf/python-lsb-steganography) repository.

<br><br><br><br><br>

# Steganography - LSB Algorithm Implementation

**Course:** ENC-K (Cryptology)  
**Institution:** Mendel University  

## Description

This repository contains a complete implementation of steganographic algorithms using the Least Significant Bit (LSB) method for hiding files within bitmap images. The project demonstrates practical application of steganography techniques, allowing users to encrypt and decrypt arbitrary files into PNG and BMP images with minimal visual distortion.

## Contents

- `steganography.py` - Main implementation of LSB steganography algorithm
- `test_steganography.py` - Comprehensive unit tests for all functionality
- `README_PROJECT.md` - Detailed project documentation in Czech
- `requirements.txt` - Python dependencies
- `examples/` - Sample files for testing the implementation
  - `input_file.txt` - Sample text file for encryption
  - `input_image.png` - Sample image for steganography

## About LSB Steganography

The Least Significant Bit (LSB) steganography method embeds secret data by replacing the least significant bits of image pixels. This technique exploits the fact that changing the LSB of color channels causes minimal visual changes to the image while allowing data to be hidden effectively.

### Key Features

- **Dual LSB Support**: Configurable 1-bit or 2-bit LSB encoding
- **Multiple Formats**: Supports PNG and BMP bitmap images
- **Large File Support**: Can handle files up to ~536.9 MB (2^32-1 bits)
- **Cross-Platform**: Pure Python implementation
- **Comprehensive Testing**: Full unit test coverage
- **Command-Line Interface**: Easy-to-use CLI with help documentation

## Algorithm Overview

The implementation processes data through several stages:

1. **Data Preparation**: Input files are converted to binary representation
2. **Prefix Generation**: 4-byte prefix stores data length for proper extraction
3. **Image Processing**: Bitmap images are loaded and capacity is calculated
4. **LSB Embedding**: Data bits replace LSBs in image color channels
5. **Image Reconstruction**: Modified pixels create the steganographic image

### Capacity Calculation

- **1 LSB**: 3 bits per pixel (RGB channels)
- **2 LSB**: 6 bits per pixel (RGB channels)
- **Maximum file size**: 4,294,967,295 bits (~536.9 MB)

## Learning Objectives

- Understanding steganography principles and LSB algorithm implementation
- Practical application of binary data manipulation and image processing
- Implementation of robust command-line tools with comprehensive testing
- Analysis of capacity limitations and security implications of steganographic methods

## Acknowledgments

- Mendel University for course materials and guidance
- Python Software Foundation and Pillow contributors for development tools
- The open-source community for documentation and examples
- Cryptography research community for foundational steganography concepts
