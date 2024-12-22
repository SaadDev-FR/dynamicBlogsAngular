import { Injectable } from '@angular/core';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

@Injectable({
  providedIn: 'root'
})
export class AzureServiceService {
 
  private speechConfig: SpeechSDK.SpeechConfig;

  constructor() {
    this.speechConfig = SpeechSDK.SpeechConfig.fromSubscription('525ba9c3c159403a923c36cea5d5ac9e', 'eastus');
    
    this.speechConfig.speechRecognitionLanguage = 'en-US';
  }

  // public convertSpeechToTextFromMic(): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
  //     const recognizer = new SpeechSDK.SpeechRecognizer(this.speechConfig, audioConfig);

  //     recognizer.recognizeOnceAsync(
  //       (result: SpeechSDK.SpeechRecognitionResult) => {
  //         if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
  //           console.log('Recognized Text:', result.text); 
  //           resolve(result.text); 
  //         } else {
  //           console.error('Speech not recognized, reason:', result.reason);
  //           reject('Speech not recognized.');
  //         }
  //         recognizer.close();
  //       },
  //       (err) => {
  //         console.error('Error during recognition:', err);
  //         reject(err);
  //         recognizer.close();
  //       }
  //     );
  //   });
  // }

  public startContinuousRecognition(onTextUpdated: (text: string) => void, onFinalResult: (text: string) => void) {
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput(); 
    const recognizer = new SpeechSDK.SpeechRecognizer(this.speechConfig, audioConfig);

    recognizer.recognizing = (sender: any, event: SpeechSDK.SpeechRecognitionEventArgs) => {
      console.log('Partial Result:', event.result.text);
      onTextUpdated(event.result.text);
    };

    recognizer.recognized = (sender: any, event: SpeechSDK.SpeechRecognitionEventArgs) => {
      if (event.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        console.log('Final Result:', event.result.text);
        onFinalResult(event.result.text); 
      } else if (event.result.reason === SpeechSDK.ResultReason.NoMatch) {
        console.log('No speech could be recognized.');
      }
    };

    recognizer.startContinuousRecognitionAsync(
      () => {
        console.log('Recognition started');
      },
      (err) => {
        console.error('Error starting recognition:', err);
      }
    );
  }
}
