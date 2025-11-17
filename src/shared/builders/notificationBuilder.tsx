export class NotificationBuilder {
  private notification: any = {};
  
  setTitle(title: string) {
    this.notification.title = title;
    return this;
  }
  
  setMessage(message: string) {
    this.notification.message = message;
    return this;
  }
  
  setType(type: 'info' | 'warning' | 'error' | 'success') {
    this.notification.type = type;
    return this;
  }
  
  setUrgent(urgent: boolean = true) {
    this.notification.urgent = urgent;
    return this;
  }
  
  build() {
    return {
      ...this.notification,
      id: generateNotificationId(),
      timestamp: new Date().toISOString()
    };
  }
}