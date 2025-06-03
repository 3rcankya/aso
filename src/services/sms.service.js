const axios = require('axios');
const { XMLBuilder, XMLParser } = require('fast-xml-parser');

// XML oluşturucu
const builder = new XMLBuilder({
  ignoreAttributes: false,
  format: true,
  attributeNamePrefix: '@_'
});

// XML ayrıştırıcı
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
});

// Mesaj uzunluğu kontrolü
const validateMessageLength = (message, encoding = 'Default') => {
  const maxLength = encoding === 'Default' ? 612 : 268;
  const currentLength = message.length;

  if (currentLength > maxLength) {
    throw new Error(`Mesaj çok uzun. Maksimum ${maxLength} karakter olabilir.`);
  }

  return {
    length: currentLength,
    parts: encoding === 'Default'
      ? Math.ceil(currentLength / 153)
      : Math.ceil(currentLength / 67)
  };
};

// Telefon numarası formatı kontrolü
const validatePhoneNumber = (phone) => {
  const phoneRegex = /^(\+90|0)?[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error('Geçersiz telefon numarası formatı');
  }
  return phone.startsWith('0') ? `90${phone.substring(1)}` : phone;
};

class SMSService {
  static async sendSMS(to, message, options = {}) {
    try {
      // Mesaj ve telefon numarası validasyonu
      validateMessageLength(message, options.encoding);
      const formattedNumber = validatePhoneNumber(to);

      const xmlRequest = builder.build({
        Submit: {
          '@_xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
          '@_xmlns': 'SmsApi',
          Credential: {
            Username: process.env.EDESMS_USERNAME,
            Password: process.env.EDESMS_PASSWORD
          },
          DataCoding: options.encoding || 'Default',
          Header: {
            From: process.env.EDESMS_HEADER,
            ValidityPeriod: options.validityPeriod || 1440,
            ...(options.scheduledTime && { ScheduledDeliveryTime: new Date(options.scheduledTime).toISOString() })
          },
          Message: message,
          To: {
            '@_xmlns:d2p1': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays',
            'd2p1:string': formattedNumber
          }
        }
      });

      const response = await axios.post('http://edesms.com/Api/Submit', xmlRequest, {
        headers: { 'Content-Type': 'application/xml' }
      });

      // XML yanıtını ayrıştır
      const parsedResponse = parser.parse(response.data);
      const statusCode = parsedResponse?.SubmitResponse?.Response?.Status?.Code;
      const statusDesc = parsedResponse?.SubmitResponse?.Response?.Status?.Description;
      const messageId = parsedResponse?.SubmitResponse?.Response?.MessageId;

      if (statusCode === 200) {
        return {
          success: true,
          messageId,
          status: { code: statusCode, description: statusDesc }
        };
      }

      // Özel hata mesajları
      let errorMessage = 'SMS gönderimi başarısız';
      let userMessage = 'SMS gönderimi sırasında bir hata oluştu.';

      switch (statusCode) {
        case 402:
          errorMessage = 'Payment Required';
          userMessage = 'SMS kredisi yetersiz. Lütfen hesabınıza kredi yükleyin.';
          break;
        case 401:
          errorMessage = 'Unauthorized';
          userMessage = 'SMS hesap bilgileri hatalı. Lütfen yönetici ile iletişime geçin.';
          break;
        case 400:
          errorMessage = 'Bad Request';
          userMessage = 'SMS gönderim parametreleri hatalı. Lütfen tekrar deneyin.';
          break;
        case 500:
          errorMessage = 'Internal Server Error';
          userMessage = 'SMS servisi geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin.';
          break;
        default:
          if (statusDesc) {
            errorMessage = statusDesc;
            userMessage = `SMS gönderimi başarısız: ${statusDesc}`;
          }
      }

      console.error('SMS API Hata Detayları:', {
        errorCode: statusCode,
        errorMessage,
        userMessage,
        fullResponse: parsedResponse
      });

      return {
        success: false,
        message: userMessage,
        errorCode: statusCode,
        errorDetails: {
          technicalMessage: errorMessage,
          response: parsedResponse
        }
      };

    } catch (error) {
      console.error('SMS gönderim hatası detayları:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });

      return {
        success: false,
        message: 'SMS gönderimi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
        errorCode: error.response?.status,
        errorDetails: {
          technicalMessage: error.message,
          response: error.response?.data
        }
      };
    }
  }

  static async sendAppointmentConfirmation(phone, appointmentDetails) {
    const message = `
      Randevunuz Oluşturuldu!
      Takip No: ${appointmentDetails.trackingNumber}
      Tarih: ${appointmentDetails.date}
      Saat: ${appointmentDetails.time}
      Servis: ${appointmentDetails.service}
      Araç: ${appointmentDetails.vehicle}
    `;
    return this.sendSMS(phone, message);
  }

  static async sendAppointmentReminder(phone, appointmentDetails) {
    const message = `
      Randevu Hatırlatması!
      Yarın saat ${appointmentDetails.time} randevunuz var.
      Servis: ${appointmentDetails.service}
      Araç: ${appointmentDetails.vehicle}
    `;
    return this.sendSMS(phone, message);
  }

  static async sendServiceCompletion(phone, serviceDetails) {
    const message = `
      Servis İşleminiz Tamamlandı!
      Araç: ${serviceDetails.vehicle}
      Servis: ${serviceDetails.service}
      Toplam Tutar: ${serviceDetails.cost} TL
      Detaylı bilgi için servisimize uğrayabilirsiniz.
    `;
    return this.sendSMS(phone, message);
  }
}

module.exports = SMSService; 