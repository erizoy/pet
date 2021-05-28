import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(
    private sanitizer: DomSanitizer
  ) {}

  transform(value: string): SafeHtml {
    value = value
      .replace(/>/g, "&gt;")
      .replace(/</g, "&lt;");

    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
