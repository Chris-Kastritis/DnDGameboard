import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, QueryList } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})

export class AppComponent{
  max = 25;
  min = 5;
  value = 5;
  circles = 0;
  name: string = "";

  previewUrl: string | null = null;
  imageUrl: string [] = [];
  numbers: Array<number> = Array(Math.pow(this.value, 2)).fill(0).map((x, i) => i);
  onSlide() {
    this.numbers = Array(Math.pow(this.value,2)).fill(0).map((x, i) => i);
  }
  calculatedWidth: string = '120px';
  currentScale = 1;
  pieces: number = 0;
  scale: number = 1;  // Initial scale value
  minScale: number = 1;  // Minimum scale
  maxScale: number = 4;  // Maximum scale
  transformOrigin: string = '50% 50%';  // Initial transform origin (center)
  dotImages: string[] = [];
  // Mouse position relative to the container
  mouseX: number = 0;
  mouseY: number = 0;
  offsetX: number = 0; // X offset for dragging
  offsetY: number = 0; // Y offset for dragging
  isDragging: boolean = false;
  isDragging1: boolean = false;
  startX: number = 0;
  startY: number = 0;
  left: number = 0;
  right: number = 0;
  top: number = 0;
  bottom: number = 0;
  circleClicked: number = -1;
  offsetX1: number = 0; // X offset for dragging
  offsetY1: number = 0;
  hasScrolled: boolean = false;
  dotClicked: boolean[] = [];
  // Handle the mouse scroll event
  onScroll(event: WheelEvent): void {
    this.hasScrolled = true;
    event.preventDefault();  // Prevent default scroll behavior

    const delta = event.deltaY > 0 ? -0.1 : 0.1;  // Determine scroll direction

    // Update scale value and keep it within the min/max range
    this.scale = Math.min(this.maxScale, Math.max(this.minScale, this.scale + delta));
   
    // Update the transform origin based on mouse position
    this.updateTransformOrigin(event);

    setTimeout(() => {
      const board = document.querySelector('.game-board') as HTMLElement;
      const boardRect = board.getBoundingClientRect();

      this.left = boardRect.left;
      this.right = boardRect.right;
      this.bottom = boardRect.bottom;
      this.top = boardRect.top;
    }, 50);
     this.offsetX = 0;
     this.offsetY = 0;
   
    
  }

  // Handle the mouse move event to track mouse position
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const container = document.querySelector('.zoom-container') as HTMLElement;
      const rect = container.getBoundingClientRect();
      const board = document.querySelector('.game-board') as HTMLElement;
      const boardRect = board.getBoundingClientRect();
      if (!this.hasScrolled) {
        this.left = boardRect.left;
        this.right = boardRect.right;
        this.bottom = boardRect.bottom;
        this.top = boardRect.top;
      }
      const box = document.querySelector('.box') as HTMLElement;
      const boxsize = box.getBoundingClientRect();
      const dx = event.clientX - this.startX;
      const dy = event.clientY - this.startY;
      let newOffsetX = this.offsetX + dx;
      let newOffsetY = this.offsetY + dy;

      const minX = -(this.right- (rect.right)) ; // Allow movement to the left beyond the container
      const minY = -(this.bottom - (rect.bottom)); // Allow movement up beyond the container
      const maxX = -(this.left - (rect.left)); // Maximum right movement, grid should never move beyond the right edge
      const maxY = -(this.top  - (rect.top)); // Maximum downward movement, grid should never move beyond the bottom edge

      // Apply the boundaries to newOffsetX and newOffsetY
      newOffsetX = Math.min(maxX, Math.max(minX, newOffsetX)); // Prevent grid from moving to the right beyond container
      newOffsetY = Math.min(maxY, Math.max(minY, newOffsetY)); // Prevent grid from moving down beyond container


      // Update the offsets and continue dragging
      this.offsetX = newOffsetX;
      this.offsetY = newOffsetY;

      // Update start positions to continue dragging from the new position
      this.startX = event.clientX;
      this.startY = event.clientY;
    }
    else {
      const container = event.currentTarget as HTMLElement;
      const rect = container.getBoundingClientRect();

      // Calculate the mouse position relative to the container
      this.mouseX = event.clientX - rect.left;
      this.mouseY = event.clientY - rect.top;
    }
  }
  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    event.preventDefault();
  }
  onMouseDown1(event: MouseEvent): void {
    this.isDragging1 = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    event.preventDefault();
  }
  onMouseUp(): void {
    this.isDragging = false;
    this.isDragging1 = false;
  }
  onCircleClick(index: number): void {
    this.circleClicked = index;
  }
  onDotClick(number: number): void {
    this.dotClicked[number] = true;
  }
  onBoxClick(number: number): void {
    const dots: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("dot") as HTMLCollectionOf<HTMLElement>;
    const dot = dots[number];
   
    if (this.circleClicked >= 0) {
      const circle: HTMLElement | null = document.getElementById('circle-' + (this.circleClicked));
      const circleLabel = document.querySelector(`#circle-${this.circleClicked} .namelabeltext`);
      const dotLabel = dot.querySelector('.namelabeltext') as HTMLElement;
      if (circle && dot.style.display != "inline-block" && circleLabel && dotLabel) {
        dot.style.display = "inline-block"
        dot.style.backgroundImage = circle.style.backgroundImage;
        dot.style.backgroundSize = 'contain';
        dot.style.backgroundRepeat = 'no-repeat';
        dot.style.backgroundPosition = 'center';
        circle.style.display = "none";
        dot.dataset['id'] = circle.dataset?.['id'];
        dotLabel.textContent = circleLabel.textContent;
        this.circleClicked = -1;
        this.pieces--;
      }
    }
    else {
      this.dotClicked.forEach((clicked, index) => {
        if (clicked) {
          if (dot.style.display != "inline-block") {
           
            dot.style.display = "inline-block"
            dot.style.backgroundImage = dots[index].style.backgroundImage;
            dot.style.backgroundSize = 'contain';
            dot.style.backgroundRepeat = 'no-repeat';
            dot.style.backgroundPosition = 'center';
            dot.dataset['id'] = dots[index].dataset?.['id'];
            const dotLabelOld = dots[index].querySelector('.namelabeltext') as HTMLElement;
            const dotLabelNew = dot.querySelector('.namelabeltext') as HTMLElement;
            if (dotLabelNew && dotLabelOld) {
              dotLabelNew.textContent = dotLabelOld.textContent;
            }
            dots[index].style.display = "none";
            this.dotClicked[index] = false;
          }
        }
      });
    }
  }
  onPiecesClick(): void {
    const dots: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("dot") as HTMLCollectionOf<HTMLElement>;
      this.dotClicked.forEach((clicked, index) => {
        if (clicked) {
          const circle: HTMLElement | null = document.getElementById('circle-' + dots[index].dataset?.['id']);
          if (circle && circle.style.display != "inline-block") {
            circle.style.display = "inline-block"
            circle.style.backgroundImage = dots[index].style.backgroundImage;
            circle.style.backgroundSize = 'contain';
            circle.style.backgroundRepeat = 'no-repeat';
            circle.style.backgroundPosition = 'center';
            const circleLabel = document.querySelector(`#circle-${this.pieces} .namelabeltext`);
            const dotLabel = dots[index].querySelector('.namelabeltext') as HTMLElement;
            if (dotLabel && circleLabel) {
              circleLabel.textContent = dotLabel.textContent;
            }
            dots[index].style.display = "none";
            this.dotClicked[index] = false;
            this.pieces++;
          }
        }
      });
    }
  // Update transform origin based on mouse position relative to the container
  updateTransformOrigin(event: WheelEvent): void {
    const container = event.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();

    // Calculate mouse position relative to the container
    const mouseXPercent = (this.mouseX / rect.width) * 100;
    const mouseYPercent = (this.mouseY / rect.height) * 100;

    // Set transform origin based on mouse position
    this.transformOrigin = `${mouseXPercent}% ${mouseYPercent}%`;
  }
  // Method to handle the scroll event
  clear(): void {
    const dots: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("dot") as HTMLCollectionOf<HTMLElement>;
    for (var i = 0; i < this.value * this.value; i++) {
      if (dots[i].style.display != 'none' && dots[i].style.display!="") {
        const circle: HTMLElement | null = document.getElementById('circle-' + dots[i].dataset?.['id']);
        const circleLabel = document.querySelector(`#circle-${dots[i].dataset?.['id']} .namelabeltext`);
        const dotLabel = dots[i].querySelector('.namelabeltext') as HTMLElement;
          if (circle) {
            if (circle.style.display != "inline-block" && circleLabel && dotLabel) {
              circle.style.display = "inline-block"
              circle.style.backgroundImage = dots[i].style.backgroundImage;
              circle.style.backgroundSize = 'contain';
              circle.style.backgroundRepeat = 'no-repeat';
              circle.style.backgroundPosition = 'center';
              circleLabel.textContent = dotLabel.textContent;
              this.pieces++;
            }
          }
        dots[i].style.display = "none";
      }
    }
  }

  create(): void {
    this.circles++;
    if (this.previewUrl == null) {
      this.imageUrl.push("");
    }
    setTimeout(() => {
      const circle: HTMLElement | null = document.getElementById('circle-' + (this.circles - 1));
      const circleLabel = document.querySelector(`#circle-${(this.circles - 1)} .namelabeltext`);
      if (circle && circleLabel) {
        if (this.imageUrl[this.circles-1]) {
          circle.style.backgroundImage = `url(${this.imageUrl[this.circles - 1]})`;
          circle.style.backgroundSize = 'contain';
          circle.style.backgroundRepeat = 'no-repeat';
          circle.style.backgroundPosition = 'center';
          this.previewUrl = "";
        }
        circleLabel.textContent = this.name;
        this.pieces++;
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.previewUrl = URL.createObjectURL(file);
      this.imageUrl.push(this.previewUrl);
    }
  }
  numSequence(n: number): Array<number> {
    return Array(n);
  }

}
