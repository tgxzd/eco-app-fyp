'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { v4 as uuidv4 } from 'uuid';

export type CreateReportResponse = {
  success: boolean;
  message: string;
  data?: any;
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

    // Extract data from form
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const imageFile = formData.get('image') as File;

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
        // Convert image to buffer
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        
        // Create form data for Pinata's REST API
        const pinataFormData = new FormData();
        
        // Add the file directly from buffer
        const blob = new Blob([buffer]);
        pinataFormData.append('file', new File([blob], `${uuidv4()}.jpg`, { type: 'image/jpeg' }));
        
        // Add metadata
        const metadata = JSON.stringify({
          name: `report-${category}-${Date.now()}`,
          keyvalues: {
            userId: user.user_id,
            category: category
          }
        });
        pinataFormData.append('pinataMetadata', metadata);
        
        // Add options
        pinataFormData.append('pinataOptions', JSON.stringify({
          cidVersion: 1
        }));
        
        // Upload directly to Pinata's API
        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.PINATA_JWT}`
          },
          body: pinataFormData
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Pinata API error: ${errorData.error || response.statusText}`);
        }
        
        const result = await response.json();
        
        // Set the IPFS hash as the image path
        imagePath = `ipfs://${result.IpfsHash}`;
      } catch (error) {
        console.error('Error uploading to IPFS:', error);
        return {
          success: false,
          message: 'Failed to upload image to IPFS',
        };
      }
    }

    // Insert the report using raw SQL query
    // This is a workaround for Prisma client generation issues
    const result = await prisma.$queryRaw`
      INSERT INTO "Report" (
        "id", 
        "description", 
        "category", 
        "status", 
        "imagePath",
        "createdAt", 
        "updatedAt", 
        "userId"
      )
      VALUES (
        gen_random_uuid(), 
        ${description}, 
        ${category}, 
        'pending', 
        ${imagePath}, 
        NOW(), 
        NOW(), 
        ${user.user_id}
      )
      RETURNING *
    `;

    // Revalidate the report page
    revalidatePath('/create-report');
    revalidatePath('/your-report');

    return {
      success: true,
      message: 'Report created successfully',
      data: result,
    };
  } catch (error) {
    console.error('Error creating report:', error);
    return {
      success: false,
      message: 'Failed to create report',
    };
  }
} 