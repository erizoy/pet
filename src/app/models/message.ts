/** Describes notification message model */
export interface Message {
  /** Mark message as collapsible by that key */
  collapse_key: string;
  /** Sender */
  from: string;
  /** Additional data */
  data: MessageBody;
}

/** Describes notification additional data */
export interface MessageBody {
  /** Notification title */
  title: string;
  /** Notification body */
  body: string;
  /** Notifications can group by it's unique tag */
  tag: string | undefined;
}
