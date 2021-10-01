type CommonHeaders = {
  from?: string[];
  to?: string[];
  messageID?: string;
  subject?: string;
};

type Header = {
  name?: string;
  value?: string;
};

type Mail = {
  timestamp?: string;
  source?: string;
  sourceArn?: string;
  sendingAccountID?: string;
  messageID?: string;
  destination?: string[];
  headersTruncated?: boolean;
  headers?: Header[];
  commonHeaders?: CommonHeaders;
  tags?: any;
};

type EventType =
  | 'Bounce'
  | 'Complaint'
  | 'Delivery'
  | 'Send'
  | 'Reject'
  | 'Open'
  | 'Click'
  | 'Rendering Failure'
  | 'DeliveryDelay';

export interface IWebHookProps {
  eventType: EventType;
  mail: Mail;
  bounce?: {
    bounceType?: string;
    bounceSubType?: string;
    bouncedRecipients?: {
      emailAddress?: string;
      action?: string;
      status?: string;
      diagnosticCode?: string;
    }[];
    timestamp?: string;
    feedbackID?: string;
    reportingMTA?: string;
  };
  complaint?: {
    complainedRecipients?: {
      emailAddress: string;
    }[];
    timestamp?: string;
    feedbackID?: string;
    userAgent?: string;
    complaintFeedbackType?: string;
    arrivalDate?: string;
  };
  delivery?: {
    timestamp?: string;
    processingTimeMillis?: number;
    recipients?: string[];
    smtpResponse?: string;
    reportingMTA?: string;
  };
  send?: any;
  reject?: {
    reason: string;
  };
  open?: {
    ipAddress: string;
    timestamp: string;
    userAgent: string;
  };
  click?: {
    ipAddress?: string;
    link?: string;
    linkTags?: any;
    timestamp?: string;
    userAgent?: string;
  };
  failure?: {
    errorMessage: string;
    templateName: string;
  };
  deliveryDelay?: {
    timestamp?: string;
    delayType?: string;
    expirationTime?: string;
    delayedRecipients?: {
      emailAddress?: string;
      status?: string;
      diagnosticCode?: string;
    }[];
  };
}

export type IWebHookRequestDTO = IWebHookProps;
