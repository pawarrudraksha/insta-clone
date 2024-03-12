
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { ApiError } from './ApiError';
dotenv.config()

const sendMail = async (otp: string, email: string) => {
  return new Promise((resolve, reject) => {
      try {
          const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                  user: 'rudraksha.test@gmail.com',
                  pass: process.env.GOOGLE_APP_PASSWORD
              }
          });

          const mailOptions = {
              from: 'Insta-clone <rudraksha.test@gmail.com>',
              to: email, 
              subject: `${otp} is your instagram code`,
              html: `<table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                  <td align="center">
                      <table cellpadding="0" cellspacing="0" border="0" style="max-width: 500px;">
                          <tr>
                              <td align="start">
                                  <img src="https://firebasestorage.googleapis.com/v0/b/insta-clone-6f053.appspot.com/o/insta-logo.png?alt=media&token=6dfe1f7d-f8a4-4c5d-8451-85c9b39ec74e" alt="logo" width="200" height="37" style="align-self: flex-start;" />
                              </td>
                          </tr>
                          <tr>
                              <td align="center">
                                  <div style="font-size: 20px; color: rgb(82, 81, 81); text-align: center;">
                                      <p style="text-align: start;">Hi,</p>
                                      <p style="text-align: start;">Someone tried to sign up for an Instagram account with <a href="http://www.gmail.com">rudraksha.test@gmail.com</a>. If it was you, enter this confirmation code in the app:</p>
                                      <p style="font-weight: 590; font-size: 35px;">${otp}</p>
                                  </div>
                              </td>
                          </tr>
                          <tr>
                              <td align="center">
                                  <img src="https://firebasestorage.googleapis.com/v0/b/insta-clone-6f053.appspot.com/o/unnamed.png?alt=media&token=c23b369b-faa1-4ae7-a216-e373f4e036c3" alt="from meta" width="60" height="30" style="margin-bottom: 20px;" />
                              </td>
                          </tr>
                          <tr>
                              <td align="center">
                                  <div style="color: rgb(146, 146, 145); font-size: 15px; text-align: center;">
                                      <p>© Insta-clone, Pune-411028</p>
                                      <p>This message was sent to <span style="text-decoration: underline;">${email}</span></p>
                                  </div>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>`
          
          };

          transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                  reject(new ApiError(500, "Unable to send email"));
              } else {
                  resolve(true);
              }
          });

      } catch (error) {
          reject(error);
      }
  });
}

export { sendMail } 