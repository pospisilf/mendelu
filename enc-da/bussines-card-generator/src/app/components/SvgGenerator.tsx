'use client';

import { useState } from 'react';
import html2canvas from 'html2canvas';

interface BusinessCardData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  address?: string;
  website?: string;
  companyDescription?: string;
  style?: string;
  colorScheme?: string;
}

interface Template {
  name: string;
  style: string;
  colorScheme: string;
}

interface LayoutElement {
  type: 'text';
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fill: string;
  fontWeight?: 'normal' | 'bold';
  textAnchor?: 'start' | 'middle' | 'end';
  transform?: string;
  fontFamily?: string;
}

interface LogoElement {
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  r?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  textAnchor?: string;
}

interface Logo {
  x: number;
  y: number;
  width: number;
  height: number;
  url: string;
  elements?: LogoElement[];
}

interface QrCode {
  x: number;
  y: number;
  size: number;
  url: string;
  foreground: string;
  background: string;
}

interface Layout {
  background: string;
  fontFamily: string;
  elements: LayoutElement[];
  logo?: Logo;
  qrCode?: QrCode;
}

const templates: Template[] = [
  {
    name: 'Modern Minimalist',
    style: 'modern minimalist',
    colorScheme: 'monochrome'
  },
  {
    name: 'Professional',
    style: 'professional corporate',
    colorScheme: 'navy and white'
  },
  {
    name: 'Creative',
    style: 'creative bold',
    colorScheme: 'vibrant'
  },
  {
    name: 'Elegant',
    style: 'elegant classic',
    colorScheme: 'gold and black'
  }
];

function BusinessCardSVG({ layout }: { layout: Layout }) {
  if (!layout || !layout.elements || !Array.isArray(layout.elements)) {
    return (
      <div className="w-full h-[654px] bg-gray-100 flex items-center justify-center text-gray-500">
        Invalid layout data
      </div>
    );
  }

  // Check if background is a gradient (contains a space)
  const isGradient = typeof layout.background === 'string' && layout.background.includes(' ');
  const gradientColors = isGradient 
    ? layout.background.split(' ') 
    : ['#ffffff', '#ffffff'];

  // Generate QR code with direct image reference
  const renderQrCode = () => {
    if (!layout.qrCode) return null;
    
    const qrCode = layout.qrCode;
    const padding = 5; // Reduced padding around the QR code
    
    // Always use high contrast colors for QR code regardless of the layout colors
    // Black on white is the most reliable for QR code scanners
    const qrCodeForeground = "000000"; // Black
    const qrCodeBackground = "ffffff"; // White
    
    // Create a URL-encoded string for the QR code service
    const encodedUrl = encodeURIComponent(qrCode.url);
    
    // Generate direct URL to QR code image with reliable colors (black on white)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodedUrl}&size=150x150&color=${qrCodeForeground}&bgcolor=${qrCodeBackground}&margin=1&qzone=0&format=png`;
    
    // Pull name color for the text label
    let nameColor = '#FFFFFF';
    const nameElement = layout.elements.find(el => 
      el.type === 'text' && 
      el.fontSize >= 30
    );
    
    if (nameElement) {
      nameColor = nameElement.fill;
    }
    
    return (
      <g transform={`translate(${qrCode.x}, ${qrCode.y})`}>
        {/* White background to ensure QR code visibility */}
        <rect 
          x={0}
          y={0}
          width={qrCode.size}
          height={qrCode.size}
          fill="#FFFFFF"
          rx={5}
          ry={5}
          stroke="#000000"
          strokeWidth={0.5}
          strokeOpacity={0.3}
        />
        
        {/* QR code as direct image reference */}
        <image 
          x={padding}
          y={padding}
          width={qrCode.size - (padding * 2)}
          height={qrCode.size - (padding * 2)}
          href={qrCodeUrl}
          preserveAspectRatio="xMidYMid meet"
        />
        
        {/* URL text below QR code */}
        <text
          x={qrCode.size / 2}
          y={qrCode.size + 20}
          fill={nameColor}
          fontSize={12}
          textAnchor="middle"
          fontFamily={layout.fontFamily || 'Arial, sans-serif'}
        >
          {qrCode.url.replace(/https?:\/\//, '')}
        </text>
      </g>
    );
  };

  // Render logo elements
  const renderLogoElement = (element: LogoElement, index: number) => {
    if (element.type === 'circle' && element.r) {
      return (
        <circle
          key={`logo-${index}`}
          cx={layout.logo!.x + element.x}
          cy={layout.logo!.y + element.y}
          r={element.r}
          fill={element.fill || 'none'}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
        />
      );
    } else if (element.type === 'rect' && element.width && element.height) {
      return (
        <rect
          key={`logo-${index}`}
          x={layout.logo!.x + element.x}
          y={layout.logo!.y + element.y}
          width={element.width}
          height={element.height}
          fill={element.fill || 'none'}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
        />
      );
    } else if (element.type === 'text' && element.text) {
      return (
        <text
          key={`logo-${index}`}
          x={layout.logo!.x + element.x}
          y={layout.logo!.y + element.y}
          fontSize={element.fontSize || 12}
          fontFamily={element.fontFamily || layout.fontFamily || 'Arial, sans-serif'}
          textAnchor={element.textAnchor || 'middle'}
          fill={element.fill || '#000000'}
        >
          {element.text}
        </text>
      );
    }
    return null;
  };

  // Render logo as an image
  const renderLogo = () => {
    if (!layout.logo) return null;
    
    if (layout.logo.url) {
      const logoWidth = layout.logo.width;
      const logoHeight = layout.logo.height;
      
      return (
        <g>
          {/* Subtle container for logo */}
          <rect
            x={layout.logo.x - 10}
            y={layout.logo.y - 10}
            width={logoWidth + 20}
            height={logoHeight + 20}
            rx={5}
            ry={5}
            fill={isGradient ? gradientColors[0] : layout.background}
            opacity={0.1}
          />
          
          {/* Logo image */}
          <image
            href={layout.logo.url}
            x={layout.logo.x}
            y={layout.logo.y}
            width={logoWidth}
            height={logoHeight}
          />
        </g>
      );
    } else if (layout.logo.elements && Array.isArray(layout.logo.elements)) {
      // Fallback to SVG elements if URL is not available
      return layout.logo.elements.map((element, index) => renderLogoElement(element, index));
    }
    
    return null;
  };

  // Check if elements overflow and reposition them
  const adjustElements = () => {
    if (!layout.elements || !Array.isArray(layout.elements)) return layout.elements;
    
    const CARD_HEIGHT = 654;
    const CARD_WIDTH = 1011;
    const MARGIN = 20; // Safe margin from edges
    
    // Check the lowest text element's position
    let maxY = 0;
    let minY = CARD_HEIGHT;
    let maxFontSize = 0;
    let totalHeight = 0;
    
    // Calculate total height, find max Y position, and max font size
    layout.elements.forEach(el => {
      if (el.type === 'text') {
        const fontSize = el.fontSize || 0;
        totalHeight += fontSize * 1.2; // Approximate line height
        maxY = Math.max(maxY, el.y);
        minY = Math.min(minY, el.y);
        maxFontSize = Math.max(maxFontSize, fontSize);
      }
    });
    
    // If text elements extend beyond the card's safe area, adjust them
    if (maxY > CARD_HEIGHT - MARGIN) {
      const overflow = maxY - (CARD_HEIGHT - MARGIN);
      const textAreaHeight = maxY - minY;
      const startingY = minY;
      
      // Calculate a scaling factor if we need to compress the text area
      const scaleFactor = overflow > textAreaHeight * 0.3 
        ? (CARD_HEIGHT - MARGIN - startingY) / textAreaHeight * 0.95
        : 1;
      
      // Adjust each element's position and potentially scale font sizes
      return layout.elements.map(el => {
        if (el.type === 'text') {
          const relativeY = el.y - startingY;
          const adjustedY = startingY + (relativeY * scaleFactor);
          
          // If we're significantly scaling down, also reduce font sizes
          const adjustedFontSize = scaleFactor < 0.8 
            ? Math.max(Math.floor(el.fontSize * (scaleFactor + 0.2)), 12)
            : el.fontSize;
          
          return {
            ...el,
            y: adjustedY,
            fontSize: adjustedFontSize
          };
        }
        return el;
      });
    }
    
    return layout.elements;
  };

  return (
    <svg 
      width="1011" 
      height="654" 
      viewBox="0 0 1011 654"
      className="business-card-svg"
      style={{ width: '100%', height: 'auto', maxWidth: '100%' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background with gradient support */}
      {isGradient ? (
        <>
          <defs>
            <linearGradient id="background-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: gradientColors[0] }} />
              <stop offset="100%" style={{ stopColor: gradientColors[1] || gradientColors[0] }} />
            </linearGradient>
          </defs>
          <rect width="1011" height="654" fill="url(#background-gradient)" />
        </>
      ) : (
        <rect width="1011" height="654" fill={layout.background || '#ffffff'} />
      )}
      
      {/* Text elements with overflow protection */}
      {adjustElements().map((el, idx) => (
        el.type === 'text' && (
          <text
            key={idx}
            x={el.x}
            y={el.y}
            fontSize={el.fontSize}
            fill={el.fill}
            fontFamily={el.fontFamily || layout.fontFamily || 'Arial, sans-serif'}
            fontWeight={el.fontWeight || 'normal'}
            textAnchor={el.textAnchor || 'start'}
            transform={el.transform}
          >
            {el.content}
          </text>
        )
      ))}

      {/* Render logo */}
      {layout.logo && renderLogo()}
      
      {/* Render QR code if present */}
      {layout.qrCode && renderQrCode()}
    </svg>
  );
}

export default function SvgGenerator() {
  const [layout, setLayout] = useState<Layout | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BusinessCardData>({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    companyDescription: '',
    style: 'modern',
    colorScheme: 'professional'
  });

  const fillTestData = () => {
    setFormData({
      name: 'Testing User',
      title: 'Principal Senior Tester',
      company: 'First Testing Company, s.r.o.',
      email: 'test@firsttestingcompany.cz',
      phone: '+420776696969',
      address: '',
      website: 'https://firsttestingcompany.cz',
      companyDescription: 'External Quality Assurance consulting firm specializing in software testing, process improvement, and quality certifications for enterprise clients. We help companies implement ISO standards and deliver reliable software products.',
      style: 'modern',
      colorScheme: 'professional'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyTemplate = (template: Template) => {
    setFormData(prev => ({
      ...prev,
      style: template.style,
      colorScheme: template.colorScheme
    }));
  };

  const generateSvg = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formDataToSend,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate SVG');
      }

      console.log('Received layout data:', data);
      
      if (!data.layout) {
        throw new Error('No layout data received from server');
      }

      setLayout(data.layout);
    } catch (error) {
      console.error('Error generating SVG:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate SVG');
      setLayout(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to download the business card as SVG
  const downloadBusinessCardSVG = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      // Create a download link for the SVG
      const svgData = new XMLSerializer().serializeToString(
        document.querySelector('.business-card-svg') as Node
      );
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = 'business-card.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    } catch (err) {
      console.error('Error downloading SVG:', err);
      alert('There was an error downloading the business card. Please try again.');
    }
  };

  // Function to download the business card as PNG
  const downloadBusinessCardPNG = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const svgElement = document.querySelector('.business-card-svg') as SVGElement;
      if (!svgElement) {
        throw new Error('SVG element not found');
      }
      
      // Get SVG dimensions
      const width = 1011;
      const height = 654;
      
      // Start loading indicator
      setLoading(true);
      
      // Clone the SVG element to avoid modifying the original
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;
      
      // Set explicit dimensions on the cloned SVG
      clonedSvg.setAttribute('width', width.toString());
      clonedSvg.setAttribute('height', height.toString());
      
      // Create a temporary div to hold the cloned SVG
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.appendChild(clonedSvg);
      document.body.appendChild(tempDiv);
      
      // Pre-load all images in the SVG
      const preloadImages = async () => {
        const images = Array.from(clonedSvg.querySelectorAll('image'));
        const imagePromises = images.map((img) => {
          return new Promise<void>((resolve) => {
            const imgElement = img as SVGImageElement;
            const href = imgElement.getAttribute('href') || '';
            if (!href) {
              resolve();
              return;
            }
            
            // Create a new image to preload
            const preloadImg = new Image();
            preloadImg.crossOrigin = 'anonymous';
            preloadImg.onload = () => resolve();
            preloadImg.onerror = () => {
              console.warn(`Failed to preload image: ${href}`);
              resolve(); // Continue anyway
            };
            preloadImg.src = href;
          });
        });
        
        // Wait for all images to load or fail
        await Promise.all(imagePromises);
      };
      
      // Use html2canvas with higher quality settings
      const renderToCanvas = async () => {
        try {
          // Wait for images to preload
          await preloadImages();
          
          // Use html2canvas with higher quality settings
          const canvas = await html2canvas(clonedSvg as unknown as HTMLElement, {
            allowTaint: true,
            useCORS: true,
            backgroundColor: null,
            scale: 3, // Higher scale for better quality
            logging: false,
            ignoreElements: (element) => {
              // Skip any hidden elements
              return window.getComputedStyle(element).display === 'none';
            }
          });
          
          // Convert to PNG with high quality
          canvas.toBlob((blob) => {
            if (blob) {
              // Create download link
              const url = URL.createObjectURL(blob);
              const downloadLink = document.createElement('a');
              downloadLink.href = url;
              downloadLink.download = 'business-card.png';
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
              URL.revokeObjectURL(url);
            } else {
              throw new Error('Failed to create PNG blob');
            }
            
            // Clean up
            document.body.removeChild(tempDiv);
            setLoading(false);
          }, 'image/png', 1.0);
          
        } catch (error) {
          console.error('Error in canvas rendering:', error);
          document.body.removeChild(tempDiv);
          setLoading(false);
          alert('Error creating PNG. Please try again.');
        }
      };
      
      // Start the rendering process
      renderToCanvas();
      
    } catch (err) {
      console.error('Error in PNG download:', err);
      alert('There was an error downloading the PNG. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-3">Choose a Template</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {templates.map((template) => (
            <button
              key={template.name}
              onClick={() => applyTemplate(template)}
              className="p-3 border border-gray-300 rounded-md hover:border-red-500 hover:bg-red-50 transition-colors text-gray-900"
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={generateSvg} className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                required
              />
            </div>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-1">
                Job Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-900 mb-1">
                Company Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-900 mb-1">
                Website (optional)
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-900 mb-1">
              Company Description (for better logo generation)
            </label>
            <textarea
              id="companyDescription"
              name="companyDescription"
              value={formData.companyDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, companyDescription: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
              rows={3}
              placeholder="Describe your company's field, products, or services to help generate a better logo"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="style" className="block text-sm font-medium text-gray-900 mb-1">
              Design Style
            </label>
            <input
              type="text"
              id="style"
              name="style"
              value={formData.style}
              onChange={handleInputChange}
              placeholder="e.g., modern, minimalist"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="colorScheme" className="block text-sm font-medium text-gray-900 mb-1">
              Color Scheme
            </label>
            <input
              type="text"
              id="colorScheme"
              name="colorScheme"
              value={formData.colorScheme}
              onChange={handleInputChange}
              placeholder="e.g., professional, vibrant"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
            />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <button
            type="button"
            onClick={fillTestData}
            className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Fill Test Data
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Generating...' : 'Generate Business Card'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {layout && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Generated Business Card</h2>
          <div className="w-full flex justify-center">
            <div className="relative w-full max-w-3xl">
              <div className="relative" style={{ paddingBottom: "64.7%" /* Aspect ratio 1011:654 */ }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <BusinessCardSVG layout={layout} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center space-x-4">
            <a 
              href="#" 
              onClick={downloadBusinessCardSVG}
              className="py-2 px-4 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download SVG</span>
            </a>
            <a 
              href="#" 
              onClick={downloadBusinessCardPNG}
              className="py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download PNG</span>
            </a>
            {formData.website && (
              <a 
                href={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(formData.website)}&size=300x300&format=png&qzone=0&margin=1&color=000000&bgcolor=ffffff`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-4 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center"
                download={`qrcode-${formData.website.replace(/https?:\/\//, '')}.png`}
              >
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <span>Download QR Code</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 