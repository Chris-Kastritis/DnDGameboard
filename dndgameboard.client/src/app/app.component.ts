import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


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
  numbers: Array<number> = Array(Math.pow(this.value, 2)).fill(0).map((x, i) => i);
  onSlide() {
    this.numbers = Array(Math.pow(this.value,2)).fill(0).map((x, i) => i);
  }
  calculatedWidth: string = '120px';
  currentScale = 1;

  scale: number = 1;  // Initial scale value
  minScale: number = 1;  // Minimum scale
  maxScale: number = 4;  // Maximum scale
  transformOrigin: string = '50% 50%';  // Initial transform origin (center)

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

  offsetX1: number = 0; // X offset for dragging
  offsetY1: number = 0;

  // Handle the mouse scroll event
   onScroll(event: WheelEvent): void {
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
    else if (this.isDragging1) {
      const dx = event.clientX - this.startX;
      const dy = event.clientY - this.startY;
      let newOffsetX = this.offsetX1 + dx;
      let newOffsetY = this.offsetY1 + dy;
      this.offsetX1 = newOffsetX;
      this.offsetY1 = newOffsetY;
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
  // Update transform origin based on mouse position relative to the container
  updateTransformOrigin(event: WheelEvent): void {
    const container = event.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();

    // Calculate mouse position relative to the container
    const mouseXPercent = (this.mouseX / rect.width) * 100;
    const mouseYPercent = (this.mouseY / rect.height) * 100;

    // Set transform origin based on mouse position
    this.transformOrigin = `${mouseXPercent}% ${mouseYPercent}%`;;
  }
  // Method to handle the scroll event
 
}
