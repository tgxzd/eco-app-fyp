import emailjs from '@emailjs/browser';

// EmailJS configuration - you'll need to add these to your .env file
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'v_UDbPuO4McdniBie';
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'your_service_id'; // You'll need to add this
const EMAILJS_TEMPLATE_ID_APPROVAL = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_APPROVAL || 'your_approval_template'; // You'll need to add this
const EMAILJS_TEMPLATE_ID_REJECTION = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_REJECTION || 'your_rejection_template'; // You'll need to add this

// Initialize EmailJS
if (typeof window !== 'undefined') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export interface EmailTemplateParams {
  to_email: string;
  organization_name: string;
  to_name?: string;
  message?: string;
  from_name?: string;
}

// Send approval email
export async function sendApprovalEmail(params: EmailTemplateParams): Promise<{ success: boolean; error?: string }> {
  try {
    if (typeof window === 'undefined') {
      console.warn('EmailJS can only be used in browser environment');
      return { success: false, error: 'EmailJS requires browser environment' };
    }

    const templateParams = {
      to_email: params.to_email,
      to_name: params.organization_name,
      organization_name: params.organization_name,
      from_name: 'EnviroConnect Admin Team',
      message: `Congratulations! Your environmental organization "${params.organization_name}" has been approved and you can now access the EnviroConnect platform.`,
      login_url: `${window.location.origin}/environmental-organization/login`,
      dashboard_url: `${window.location.origin}/environmental-organization/dashboard`,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_APPROVAL,
      templateParams
    );

    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, error: `EmailJS responded with status: ${response.status}` };
    }
  } catch (error) {
    console.error('Error sending approval email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Send rejection email
export async function sendRejectionEmail(params: EmailTemplateParams): Promise<{ success: boolean; error?: string }> {
  try {
    if (typeof window === 'undefined') {
      console.warn('EmailJS can only be used in browser environment');
      return { success: false, error: 'EmailJS requires browser environment' };
    }

    const templateParams = {
      to_email: params.to_email,
      to_name: params.organization_name,
      organization_name: params.organization_name,
      from_name: 'EnviroConnect Admin Team',
      message: params.message || `We regret to inform you that your application for "${params.organization_name}" has been rejected. Please contact our support team if you have any questions.`,
      support_email: 'support@enviroconnect.com',
      contact_url: `${window.location.origin}/contact`,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_REJECTION,
      templateParams
    );

    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, error: `EmailJS responded with status: ${response.status}` };
    }
  } catch (error) {
    console.error('Error sending rejection email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Test email function for debugging
export async function sendTestEmail(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (typeof window === 'undefined') {
      return { success: false, error: 'EmailJS requires browser environment' };
    }

    const templateParams = {
      to_email: email,
      to_name: 'Test Organization',
      organization_name: 'Test Organization',
      from_name: 'EnviroConnect Admin Team',
      message: 'This is a test email from EnviroConnect.',
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_APPROVAL,
      templateParams
    );

    return { success: response.status === 200 };
  } catch (error) {
    console.error('Error sending test email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
} 