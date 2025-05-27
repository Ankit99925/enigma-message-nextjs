import { render } from '@react-email/components';
import { VerificationEmail } from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';
import { transport } from '@/lib/nodemailer';


export async function sendVerificationEmail(username: string, verifyCode: string, email: string, verifyCodeExpiry: number): Promise<ApiResponse> {

  try {

    const emailHtml = await render(VerificationEmail({ username, verifyCode, verifyCodeExpiry }));

    const options = {
      from: process.env.NODEMAILER_EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: emailHtml,
    };

    await transport.sendMail(options);

    return {
      success: true,
      message: 'Verification email sent',

    };

  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      success: false,
      message: `Error sending verification email: ${error}`,
    };
  }

}