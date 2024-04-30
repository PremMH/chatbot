import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userInput: any;
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('inputField') inputField!: ElementRef;

  constructor(private http: HttpClient, private renderer: Renderer2) {}

  ngOnInit() {
    // Display initial bot message
    this.displayBotMessage("Hello! How can I assist you today?");
  }

  sendMessage() {
    const userMessage = this.inputField.nativeElement.value.trim();
    if (userMessage === '') return;

    // Store the input message in a variable
    this.userInput = userMessage;

    // Log the input message to the console
    console.log('User input:', this.userInput);

    const userMessageElement = this.createMessageElement(userMessage, 'user');
    this.chatContainer.nativeElement.appendChild(userMessageElement);

    // Clear the input field after capturing the input
    this.inputField.nativeElement.value = '';
    console.log('the user input: ', userMessage)

    const options = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'b896190944msh966f3c050787178p1c0d8ajsn375ced29ef2c',
        'X-RapidAPI-Host': 'chatgpt-42.p.rapidapi.com'
      })
    };

    this.http.post<any>('https://chatgpt-42.p.rapidapi.com/gpt4', {
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ],
      web_access: false
    }, options).subscribe(response => {
      console.log(response);
      const botMessage = response.result;
      const botMessageElement = this.createMessageElement(botMessage, 'bot');
      this.chatContainer.nativeElement.appendChild(botMessageElement);
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }, error => {
      console.error(error);
    });
  }

  displayBotMessage(message: string) {
    const botMessageElement = this.createMessageElement(message, 'bot');
    this.chatContainer.nativeElement.appendChild(botMessageElement);
    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
  }

  createMessageElement(message: string, sender: string): HTMLElement {
    const messageElement = this.renderer.createElement('div');
    this.renderer.addClass(messageElement, 'message');
    this.renderer.addClass(messageElement, sender);
  
    const messageLabel = this.renderer.createElement('div');
    this.renderer.addClass(messageLabel, 'message-label');
    this.renderer.setProperty(messageLabel, 'textContent', sender === 'user' ? 'You' : 'ChatBot:');
  
    const messageBubble = this.renderer.createElement('div');
    this.renderer.addClass(messageBubble, 'message-bubble');
    this.renderer.setProperty(messageBubble, 'textContent', message);
  
    // Increase line height for message bubble
    this.renderer.setStyle(messageBubble, 'line-height', '1.6'); // Adjust the value as needed
  
    this.renderer.appendChild(messageElement, messageLabel);
    this.renderer.appendChild(messageElement, messageBubble);
  
    return messageElement;
  }
  
}
