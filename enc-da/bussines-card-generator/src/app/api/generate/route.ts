import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface VisualStyle {
  background: {
    type: string;
    colors: string[];
    direction?: string;
  };
  accent: string;
  fontFamily: string;
  textColors: {
    primary: string;
    secondary: string;
  };
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

interface Position {
  x: number;
  y: number;
}

interface TextArea {
  x: number;
  y: number;
  width: number;
  maxY: number;
  alignRight: boolean;
  corner: string;
}

interface LayoutOption {
  name: string;
  description: string;
  logoPosition: Position;
  qrPosition: Position;
  textArea: TextArea;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const businessCardData = {
      name: formData.get('name')?.toString() || 'FULL NAME',
      title: formData.get('title')?.toString() || 'CEO & Founder',
      company: formData.get('company')?.toString() || 'COMPANY NAME',
      email: formData.get('email')?.toString() || 'email@example.com',
      phone: formData.get('phone')?.toString() || '+1 (555) 000-0000',
      website: formData.get('website')?.toString() || 'example.com',
      companyDescription: formData.get('companyDescription')?.toString() || '',
      style: formData.get('style')?.toString() || 'modern',
      colorScheme: formData.get('colorScheme')?.toString() || 'dark',
    };

    const stylePrompt = `
Design a professional business card background with the following specifications:
- Style: ${businessCardData.style}
- Color scheme: ${businessCardData.colorScheme}
- Card size: 1011 x 654 pixels (85mm x 55mm)

Return only valid JSON with this structure:
{
  "background": {
    "type": "solid",
    "colors": ["<hex color>"]
  },
  "accent": "<hex color>", // Complementary color for important text
  "fontFamily": "<modern, professional font family>",
  "textColors": {
    "primary": "<hex color>", // For name, title, and company
    "secondary": "<hex color>" // For contact details
  }
}

Design Guidelines:
1. Color Selection:
   - Choose a clean, SOLID background color (no gradients)
   - Use high contrast between background and text colors
   - Create a cohesive color scheme with maximum 3 colors total
   - Ensure the primary text color works well for the name, title, and company name
   - Select a complementary secondary color for contact details

2. Visual Harmony:
   - Background should be subtle and professional
   - Text colors should be clearly legible against the background
   - For professional styles: use elegant, subdued colors
   - For creative styles: use more distinctive color combinations
   - For elegant styles: use sophisticated color palettes (deep blues, rich burgundies, etc.)

Return only raw JSON, no explanations.
`;

    const logoPrompt = (visualStyle: VisualStyle) => `
Generate a simple, professional SVG logo for a company named "${businessCardData.company}" in the field of "${businessCardData.title}".

Use the following color palette:
${JSON.stringify(visualStyle, null, 2)}

Return only valid JSON with this structure:
{
  "logo": {
    "x": number, // position on card (typically top-right corner of the card, between 750-900px)
    "y": number, // typically between 50-150px from top
    "width": number, // reasonable size for a business card logo (100-150px)
    "height": number,
    "elements": [
      {
        "type": "circle|rect|text",
        "x": number, // relative to logo x position
        "y": number, // relative to logo y position
        "width": number, // for rect
        "height": number, // for rect
        "r": number, // for circle
        "fill": "<hex color>",
        "stroke": "<hex color>", // optional
        "strokeWidth": number, // optional
        "text": "string", // for text elements, typically initials
        "fontSize": number, // for text elements
        "fontFamily": "string", // for text elements
        "textAnchor": "middle" // for text elements
      },
      ...
    ]
  }
}

Design Guidelines:
1. Logo Style:
   - Create a simple, iconic logo that represents the company's field
   - Use abstract shapes or monogram-style lettering
   - Consider the first letter(s) of the company name
   - Ensure the logo is visually balanced
   - No complex graphics - keep it minimal and professional

2. Color Usage:
   - Use colors from the provided visual style that complement each other
   - Limit to 2-3 colors maximum
   - Create sufficient contrast for visibility

3. Size and Position:
   - Position in the top-right corner of the card (x: 750-900, y: 50-150)
   - Size between 100-150px width/height
   - Keep the design within these boundaries to avoid collisions with text elements
   - Ensure it's legible at small sizes

Return only raw JSON, no explanations.
`;

    // Common margin settings for consistency
    const MARGIN = 60; // Standard margin from all edges
    const CARD_WIDTH = 1011;
    const CARD_HEIGHT = 654;
    
    // Layout options - we'll select one based on style and company
    const layoutOptions: LayoutOption[] = [
      {
        name: 'lower-left-text',
        description: 'Text in lower-left, Logo in upper-left, QR code in upper-right',
        logoPosition: { x: MARGIN, y: MARGIN },
        qrPosition: { x: CARD_WIDTH - MARGIN - 130, y: MARGIN },
        textArea: { 
          x: MARGIN, 
          y: MARGIN + 200, 
          width: 500, 
          maxY: CARD_HEIGHT - MARGIN, 
          alignRight: false, 
          corner: 'lower-left' 
        }
      },
      {
        name: 'lower-right-text',
        description: 'Text in lower-right, Logo in upper-right, QR code in upper-left',
        logoPosition: { x: CARD_WIDTH - MARGIN - 180, y: MARGIN },
        qrPosition: { x: MARGIN, y: MARGIN },
        textArea: { 
          x: CARD_WIDTH - MARGIN - 450, 
          y: MARGIN + 200, 
          width: 450, 
          maxY: CARD_HEIGHT - MARGIN, 
          alignRight: true, 
          corner: 'lower-right' 
        }
      }
    ];
    
    // Choose layout based on style and company name or pick randomly
    const randomIndex = Math.floor(Math.random() * layoutOptions.length);
    const selectedLayout = layoutOptions[randomIndex];
    
    console.log('Selected layout:', selectedLayout.name);

    console.log('=== Style Prompt ===');
    console.log(stylePrompt);
    
    // First, get the visual style
    const styleCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: `You are an expert UI designer specializing in color theory and visual aesthetics.`,
        },
        {
          role: 'user',
          content: stylePrompt,
        },
      ],
    });

    const styleJsonText = styleCompletion.choices[0].message.content;
    if (!styleJsonText) {
      throw new Error('No response content for visual style');
    }

    // Clean the style JSON response
    const cleanedStyleJsonText = styleJsonText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    console.log('Raw style response:', styleJsonText);
    console.log('Cleaned style JSON:', cleanedStyleJsonText);

    const visualStyle = JSON.parse(cleanedStyleJsonText);
    console.log('Parsed visual style:', visualStyle);
    
    // Generate a simple logo based on the company name
    console.log('=== Logo Prompt ===');
    
    // Create a DALL-E prompt for the logo
    const companyDescription = businessCardData.companyDescription 
      ? businessCardData.companyDescription.trim() 
      : `in the field of ${businessCardData.title}`;

    const dalleLogoPrompt = `Create a professional, minimalist logo for a company named "${businessCardData.company}" that ${companyDescription}.

IMPORTANT REQUIREMENTS:
1. Place the logo on a solid background that matches the card's background color (${visualStyle.background.colors[0]})
2. Create only a symbol or icon (NO TEXT or company name in the logo)
3. Design must be centered and compact
4. The logo itself should use primarily ${visualStyle.textColors.primary} and ${visualStyle.accent} colors
5. Use simple, clean shapes with clear definition
6. The design should work well in any shape (square, rectangle, etc.)
7. Preserve negative space around the logo

Style and Content:
- Use a clean, modern style with a simple icon or abstract mark that clearly represents the company's field
- The logo should work well on a business card and be recognizable at small sizes (approx 150-180px)
- Make it professional, clean, and memorable
- Ensure high contrast and clean edges

The final output should be a professional logo that represents ${businessCardData.company} in the field of ${companyDescription}.`;

    console.log('DALL-E Logo Prompt:', dalleLogoPrompt);
    
    // Generate logo using DALL-E
    const logoImage = await openai.images.generate({
      model: "dall-e-3",
      prompt: dalleLogoPrompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });
    
    if (!logoImage.data || logoImage.data.length === 0) {
      throw new Error('No logo image generated from DALL-E');
    }
    
    const logoUrl = logoImage.data[0].url;
    console.log('Generated logo URL:', logoUrl);
    
    // Note: DALL-E 3 has limitations with true transparency
    // In a production environment, you would:
    // 1. Download the image from logoUrl
    // 2. Use image processing (e.g., with Sharp or a similar library) to remove the background
    // 3. Upload the processed image to a storage service
    // 4. Use the URL of the processed image
    
    // Store logo data with the selected position
    const logoData = {
      logo: {
        x: selectedLayout.logoPosition.x,
        y: selectedLayout.logoPosition.y,
        width: 180,
        height: 180,
        url: logoUrl,
        // Add a note about transparency issues
        note: "For production use, post-process this image to remove the background using an external tool."
      }
    };
    
    // Now, get the text layout using the visual style
    console.log('=== Layout Prompt ===');
    
    const layoutPrompt = (visualStyle: VisualStyle) => `
Using the provided visual style, create a professional text layout for a business card with the following information:
- Name: ${businessCardData.name}
- Title: ${businessCardData.title}
- Company: ${businessCardData.company}
- Email: ${businessCardData.email}
- Phone: ${businessCardData.phone}
- Website: ${businessCardData.website}

Visual style JSON: 
${JSON.stringify(visualStyle, null, 2)}

Layout constraints:
- Card dimensions: ${CARD_WIDTH} x ${CARD_HEIGHT} pixels
- TEXT POSITION: ${selectedLayout.textArea.corner} corner
- Text area: x: ${selectedLayout.textArea.x}, y: ${selectedLayout.textArea.y}, width: ${selectedLayout.textArea.width}, maxY: ${selectedLayout.textArea.maxY}
- Consistent margin of ${MARGIN}px from all card edges
- Text alignment: ${selectedLayout.textArea.alignRight ? 'right-aligned (text should end at x + width)' : 'left-aligned (text should start at x)'}
- Logo position: ${selectedLayout.logoPosition.x < CARD_WIDTH/2 ? 'upper-left corner' : 'upper-right corner'}
- QR code position: ${selectedLayout.qrPosition.x < CARD_WIDTH/2 ? 'upper-left corner' : 'upper-right corner'}

Return only valid JSON with this structure:
{
  "elements": [
    {
      "type": "text",
      "content": "string",
      "x": number,
      "y": number,
      "fontSize": number,
      "fill": "<hex color>",
      "fontWeight": "normal|bold",
      "textAnchor": "${selectedLayout.textArea.alignRight ? 'end' : 'start'}",
      "fontFamily": "string" // optional override
    },
    ...
  ]
}

Text Layout Guidelines:
1. Text Hierarchy and Placement:
   - Name: Large (40-60px), most prominent, using primary text color
   - Title: Medium (24-32px), positioned directly below name, using primary text color
   - Company: Medium-large (28-36px), appropriate prominence, using primary text color
   - Contact details: Smaller (16-20px), organized and grouped together, using secondary text color
   - IMPORTANT: Use visualStyle.textColors.primary for name, title, and company name
   - IMPORTANT: Use visualStyle.textColors.secondary for contact details (email, phone, website)
   - VERY IMPORTANT: TEXT MUST BE ALIGNED TO THE ${selectedLayout.textArea.corner.toUpperCase()} CORNER
   - Place all text elements within the specified text area, maintaining the ${MARGIN}px margin from edges

2. Layout Principles:
   - Create a clear visual hierarchy through size and weight (not color variation)
   - Ensure proper spacing between elements (at least 15-20px)
   - ${selectedLayout.textArea.alignRight ? 'Right-align text elements for a clean edge on the right' : 'Left-align text elements for readability'}
   - Group related information together (e.g., contact details)
   - Be creative with font sizes and weights for visual interest
   - Use consistent colors - primary color for name/title/company, secondary for contact details
   - Maintain consistent margins from all edges

Return only raw JSON, no explanations.
`;

    console.log(layoutPrompt(visualStyle));
    
    const layoutCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: `You are an expert typography and layout designer specializing in business cards.`,
        },
        {
          role: 'user',
          content: layoutPrompt(visualStyle),
        },
      ],
    });

    const layoutJsonText = layoutCompletion.choices[0].message.content;
    if (!layoutJsonText) {
      throw new Error('No response content for layout');
    }

    // Clean the layout JSON response
    const cleanedLayoutJsonText = layoutJsonText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    console.log('Raw layout response:', layoutJsonText);
    console.log('Cleaned layout JSON:', cleanedLayoutJsonText);

    const textLayout = JSON.parse(cleanedLayoutJsonText);
    console.log('Parsed text layout:', textLayout);
    
    // Generate QR code data if website is provided
    let qrCodeData = null;
    if (businessCardData.website && businessCardData.website.trim() !== '') {
      // Extract the website from form data
      const website = businessCardData.website.trim();
      
      // Create a proper URL if it doesn't have a protocol
      let websiteUrl = website;
      try {
        // Test if it's a valid URL
        new URL(website);
        // If it passes, it's already a valid URL with protocol
        websiteUrl = website;
      } catch (e) {
        // If parsing fails, it's missing the protocol
        websiteUrl = `https://${website}`;
      }
      
      // Simplify color handling - use primary color for QR code
      // The Google Charts API uses the specified color for the QR code itself
      const foregroundColor = visualStyle.textColors.primary || '#000000';
      
      // For the background, always use transparent
      const backgroundColor = 'transparent';
      
      // Place QR code according to the layout
      qrCodeData = {
        qrCode: {
          x: selectedLayout.qrPosition.x,
          y: selectedLayout.qrPosition.y,
          size: 130,
          url: websiteUrl,
          foreground: foregroundColor,
          background: backgroundColor
        }
      };
      
      console.log('QR code data:', qrCodeData);
    }

    // Combine the visual style, text layout, logo, and QR code into a final layout
    const finalLayout = {
      background: visualStyle.background.type === 'gradient' 
        ? visualStyle.background.colors.join(' ') 
        : visualStyle.background.colors[0],
      fontFamily: visualStyle.fontFamily,
      elements: textLayout.elements,
      logo: logoData.logo,
      qrCode: qrCodeData?.qrCode
    };

    console.log('Final combined layout:', finalLayout);

    // Validate the layout structure
    if (!finalLayout || typeof finalLayout !== 'object') {
      console.error('Invalid layout: not an object', finalLayout);
      throw new Error('Invalid layout: not an object');
    }

    if (!Array.isArray(finalLayout.elements)) {
      console.error('Invalid layout: missing elements array', finalLayout);
      throw new Error('Invalid layout: missing elements array');
    }

    return NextResponse.json({ layout: finalLayout });
  } catch (error: any) {
    console.error('Error generating layout:', error);
    return NextResponse.json(
      { error: 'Failed to generate business card layout' },
      { status: 500 }
    );
  }
}
