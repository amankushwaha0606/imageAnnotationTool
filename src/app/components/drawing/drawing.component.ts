import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements OnInit {
  private drawing = false;
  private startX: number = 0;
  private startY: number = 0;
  currentRectangle: any;
  isEditing: boolean = false;
  canDragSelected: boolean = true;
  
  isMovingStartXAxis: boolean = false;
  isMovingEndXAxis: boolean = false;
  
  canvasElement: any; // Element for all boundries
  canvasWidth: any;
  canvasHeight: any;

  backgroundImageUrls = [
    '../../../assets/img/Image1.jpg',
    '../../../assets/img/Image2.jpg',
    '../../../assets/img/Image4.jpg',
    '../../../assets/img/Image5.jpg',
  ];

  backgroundImageIndex = 0;
  public globalImagesRectangles: any[][] = Array.from(
    { length: this.backgroundImageUrls.length },
    () => []
  );
  isMovingStartYAxis: boolean = false;
  isMovingEndYAxis: boolean = false;
  selectedColor: string = '#000000'; // Initialize with a default color. Use this if you want colored boundry
  isColorCodingJson: boolean = false;
  dragOffsetX: number = 0;
  dragOffsetY: number = 0;

  selectedRectangle: any;

  constructor() {}

  ngOnInit() {
    let c = document.getElementById('canvasElement') as HTMLCanvasElement;
    if (c && c.getContext) {
      this.canvasElement = c.getContext('2d');
    } else {
      console.error('Canvas element or getContext method not supported.');
    }
  }

  // function after image loads
  getCanvasHeightWidth() {
    let element = document.getElementById('canvasContainer');
    this.canvasWidth = element?.offsetWidth;
    this.canvasHeight = element?.offsetHeight;
    setTimeout(() => {
      this.clearCanvas();
      this.drawAllRectangles();
    }, 0);
  }

  onMouseDown(event: MouseEvent) {
    if (this.isEditing) {
      const clickX = event.offsetX;
      const clickY = event.offsetY;
      for (const rect of this.globalImagesRectangles[
        this.backgroundImageIndex
      ]) {
        if (
          ((clickX < rect.startX + 2 && clickX > rect.startX - 2) ||
            (clickX < rect.endX + 2 && clickX > rect.endX - 2)) &&
          clickY > rect.startY + 2 &&
          clickY < rect.endY - 2
        ) {
          this.selectedRectangle = rect;
          if (clickX < rect.startX + 2 && clickX > rect.startX - 2) {
            this.selectedRectangle.startX = clickX;
            this.isMovingStartXAxis = true;
          } else {
            this.selectedRectangle.endX = clickX;
            this.isMovingEndXAxis = true;
          }
        } else if (
          ((clickY < rect.startY + 2 && clickY > rect.startY - 2) ||
            (clickY < rect.endY + 2 && clickY > rect.endY - 2)) &&
          clickX > rect.startX + 2 &&
          clickX < rect.endX - 2
        ) {
          this.selectedRectangle = rect;
          if (clickY < rect.startY + 2 && clickY > rect.startY - 2) {
            this.selectedRectangle.startY = clickY;
            this.isMovingStartYAxis = true;
          } else {
            this.selectedRectangle.endY = clickY;
            this.isMovingEndYAxis = true;
          }
        } else if (
          clickX >= rect.startX &&
          clickX <= rect.endX &&
          clickY >= rect.startY &&
          clickY <= rect.endY
        ) {
          this.canDragSelected = true;
          this.selectedRectangle = rect;
          this.dragOffsetX = clickX - rect.startX;
          this.dragOffsetY = clickY - rect.startY;
          break;
        }
      }
    } else {
      this.drawing = true;
      this.startX = event.offsetX;
      this.startY = event.offsetY;
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.isEditing && this.selectedRectangle) {
      const height =
        this.selectedRectangle.endY - this.selectedRectangle.startY;
      const width = this.selectedRectangle.endX - this.selectedRectangle.startX;
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;
      const { startX, startY, endX, endY } = this.selectedRectangle;
      if (this.isMovingStartXAxis) {
        this.selectedRectangle.startX = mouseX;
        if (mouseX > endX) {
          this.isMovingEndXAxis = true;
          this.isMovingStartXAxis = false;
        }
      } else if (this.isMovingEndXAxis) {
        this.selectedRectangle.endX = mouseX;
        if (startX > mouseX) {
          this.isMovingEndXAxis = false;
          this.isMovingStartXAxis = true;
        }
      } else if (this.isMovingStartYAxis) {
        this.selectedRectangle.startY = mouseY;
        if (mouseY > endY) {
          this.isMovingEndYAxis = true;
          this.isMovingStartYAxis = false;
        }
      } else if (this.isMovingEndYAxis) {
        this.selectedRectangle.endY = mouseY;
        if (startY > mouseY) {
          this.isMovingEndYAxis = false;
          this.isMovingStartYAxis = true;
        }
      } else if (this.canDragSelected) {
        this.selectedRectangle.startX = mouseX - this.dragOffsetX;
        this.selectedRectangle.startY = mouseY - this.dragOffsetY;
        this.selectedRectangle.endX = this.selectedRectangle.startX + width;
        this.selectedRectangle.endY = this.selectedRectangle.startY + height;
      }
      this.clearCanvas();
      this.drawAllRectangles();
    } else {
      if (this.drawing) {
        const currentX = event.offsetX;
        const currentY = event.offsetY;
        this.clearCanvas();
        this.drawRect(
          this.startX,
          this.startY,
          currentX,
          currentY,
          this.selectedColor
        );
      }
    }
  }

  onMouseUp(event: MouseEvent) {
    if (this.isEditing) {
      this.canDragSelected = false;
      this.isMovingEndXAxis = false;
      this.isMovingStartXAxis = false;
      this.isMovingEndYAxis = false;
      this.isMovingStartYAxis = false;
    } else {
      if (this.drawing) {
        this.drawing = false;
        const currentX = event.offsetX;
        const currentY = event.offsetY;

        this.currentRectangle = {
          startX: this.startX,
          startY: this.startY,
          endX: currentX,
          endY: currentY,
          color: this.selectedColor,
        };
        this.drawAllRectangles();
      }
    }
  }

  private clearCanvas() {
    this.canvasElement.clearRect(0, 0, 2000, 2000);
  }

  // make a rectangle boundry
  private drawRect(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string
  ) {
    const ctx = this.canvasElement;
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
  }

  // to draw all rectangles
  private drawAllRectangles() {
    if (!this.isEditing && this.currentRectangle) {
      this.drawRect(
        this.currentRectangle.startX,
        this.currentRectangle.startY,
        this.currentRectangle.endX,
        this.currentRectangle.endY,
        this.currentRectangle.color
      );
    }
    for (const rect of this.globalImagesRectangles[this.backgroundImageIndex]) {
      this.drawRect(rect.startX, rect.startY, rect.endX, rect.endY, rect.color);
    }
  }

  dimensionChanging() {
    this.clearCanvas();
    this.drawAllRectangles();
  }

  saveCurrentCanvas() {
    this.globalImagesRectangles[this.backgroundImageIndex].push(
      this.currentRectangle
    );
    this.currentRectangle = undefined;
  }

  removeCurrentCanvas() {
    if (this.isEditing) {
      let index = this.globalImagesRectangles[
        this.backgroundImageIndex
      ].indexOf(this.selectedRectangle);
      this.globalImagesRectangles[this.backgroundImageIndex].splice(index, 1);
    }
    this.currentRectangle = undefined;
    this.isEditing = false;
    this.canDragSelected = false;
    this.clearCanvas();
    this.drawAllRectangles();
  }

  editRectangle() {
    this.isEditing = !this.isEditing;
  }

  changeImage(changeInIndex: number) {
    this.isEditing = false;
    this.drawing = false;
    this.selectedRectangle = undefined;
    this.backgroundImageIndex += changeInIndex;
  }

  // to print boundries as JSON
  onSubmit() {
    let submitJSON: any = {};
    for (let index in this.globalImagesRectangles) {
      submitJSON[`${index}`] = [];
      for (let rects of this.globalImagesRectangles[index]) {
        let rect:any = {
          x1: rects.startX,
          y1: rects.startY,
          x2: rects.endX,
          y2: rects.endY,
        };

        // if you want color codes in JSON
        if(this.isColorCodingJson) {
          rect['color'] = rects.color;
        }
        submitJSON[`${index}`].push(rect);
      }
    }
    console.log(submitJSON);
    const jsonBlob = new Blob([JSON.stringify(submitJSON)], { type: 'application/json' });
    const url = window.URL.createObjectURL(jsonBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'annotations-json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // to print boundries as image
  saveCanvasAsImage() {
    if (!this.canvasElement) {
      console.error('Something went wrong.');
      return;
    }

    requestAnimationFrame(() => {
      const image = new Image();
      image.src = this.canvasElement.canvas.toDataURL('image/jpeg');
      const link = document.createElement('a');
      link.href = image.src;
      link.download = 'canvas-image' + this.backgroundImageIndex + '.jpg';
      link.click();
    });
  }
}
