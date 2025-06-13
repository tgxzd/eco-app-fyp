'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export type Report = {
  id: string;
  description: string;
  category: string;
  imagePath?: string | null;
  userId: string;
  locationId?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateReportResponse = {
  success: boolean;
  message: string;
  data?: Report;
};

export async function createReport(formData: FormData): Promise<CreateReportResponse> {
  try {
    // Get the current user
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: 'You must be logged in to create a report',
      };
    }

    console.log("User ID:", user.user_id); // Debug log to verify user ID
    
    // Check if user exists in database
    const dbUser = await prisma.user.findUnique({
      where: { user_id: user.user_id }
    });
    
    if (!dbUser) {
      return {
        success: false,
        message: 'User not found in database',
      };
    }

    // Extract data from form
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const imageFile = formData.get('image') as File;
    
    // Extract location data
    const latitude = formData.get('latitude') as string;
    const longitude = formData.get('longitude') as string;
    const address = formData.get('address') as string;

    // Validate input
    if (!description || !category) {
      return {
        success: false,
        message: 'Description and category are required',
      };
    }

    let imagePath = null;
    
    // Process image if uploaded
    if (imageFile && imageFile.size > 0) {
      try {
        // Convert image to buffer for Pinata upload
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        
        // Create form data for Pinata upload
        const pinataForm = new FormData();
        const filename = `report-${category}-${Date.now()}.jpg`;
        
        // Add file to form
        const blob = new Blob([buffer], { type: 'image/jpeg' });
        pinataForm.append('file', new File([blob], filename, { type: 'image/jpeg' }));
        
        // Add metadata
        pinataForm.append('pinataMetadata', JSON.stringify({
          name: filename,
          keyvalues: {
            userId: user.user_id,
            category: category
          }
        }));
        
        // Upload to Pinata
        console.log("Uploading to Pinata with JWT:", process.env.PINATA_JWT?.substring(0, 20) + "...");
        
        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.PINATA_JWT}`
          },
          body: pinataForm
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Pinata API error:", errorData);
          throw new Error(`Pinata API error: ${JSON.stringify(errorData)}`);
        }
        
        const result = await response.json();
        console.log("Pinata upload result:", result);
        
        // Set image path with IPFS hash using Pinata gateway URL
        const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || 'tan-worthy-ladybug-708.mypinata.cloud';
        imagePath = `https://${gatewayUrl}/ipfs/${result.IpfsHash}`;
        console.log("Image saved with path:", imagePath);
      } catch (error) {
        console.error('Error uploading to IPFS:', error);
        // Continue with report creation even if image upload fails
        // Just log the error and proceed without an image
      }
    }

    // Create location record if latitude/longitude provided
    let locationId = null;
    if (latitude && longitude) {
      try {
        console.log("Creating location for user:", user.user_id);
        
        // Create location record using Prisma model API
        const location = await prisma.location.create({
          data: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            address: address || "",
            userId: user.user_id
          }
        });
        
        locationId = location.id;
        console.log("Location created with ID:", locationId);
      } catch (error) {
        console.error("Error creating location record:", error);
        // Continue with report creation even if location storage fails
      }
    }

    // Create the report using Prisma model API
    console.log("Creating report for user:", user.user_id);
    const report = await prisma.report.create({
      data: {
        description,
        category,
        imagePath,
        userId: user.user_id,
        locationId
      }
    });
    
    console.log("Report created with ID:", report.id);

    // Revalidate the report page
    revalidatePath('/create-report');
    revalidatePath('/your-report');

    return {
      success: true,
      message: 'Report created successfully',
      data: report,
    };
  } catch (error) {
    console.error('Error creating report:', error);
    return {
      success: false,
      message: 'Failed to create report: ' + (error instanceof Error ? error.message : String(error)),
    };
  }
} 