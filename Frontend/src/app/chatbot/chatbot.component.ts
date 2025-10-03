import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatbotService } from 'src/Services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  messages: { user: string; bot: string }[] = [];
  userInput: string = '';
  loading: boolean = false;

  constructor(private chatbotService: ChatbotService) {}

  isNumberedList(text: string): boolean {
    return /^\s*1\.\s/.test(text);
  }

  extractNumberedItems(text: string): string[] {
    const regex = /(\d+\.\s[^]*?)(?=\d+\.\s|$)/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1].trim());
    }
    return matches.length > 1 ? matches : [text];
  }

  splitBotMessage(text: string): string[] {
    return text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  }

  sendMessage() {
    if (this.userInput.trim() === '') return;

    const userMessage = this.userInput.trim();
    this.messages.push({ user: userMessage, bot: '' });
    const currentIndex = this.messages.length - 1;

    this.loading = true;

    this.chatbotService.sendMessage(userMessage).subscribe({
      next: (chunk: string) => {
        this.messages[currentIndex].bot += chunk;
      },
      complete: () => {
        this.loading = false;
      },
      error: (err) => {
        this.messages[currentIndex].bot = '❌ Une erreur est survenue';
        this.loading = false;
        console.error(err);
      }
    });

    this.userInput = '';
  }
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

ngAfterViewChecked() {
  this.scrollToBottom();
}

scrollToBottom(): void {
  try {
    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
  } catch (err) {}
}
}
