import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [MintModule],
  imports: [CommonModule, FormsModule, IonicModule, MintModule],
})
export class MintModule {}
