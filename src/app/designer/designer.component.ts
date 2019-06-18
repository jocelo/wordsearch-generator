import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../shared/services/firebase.service';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.css']
})
export class DesignerComponent implements OnInit {
  seasonId: number = -1;
  episodeId: number = -1;

  constructor(
    private route: ActivatedRoute,
    private backend: FirebaseService ) { 
    this.seasonId = this.route.snapshot.params.season;
    this.episodeId = this.route.snapshot.params.episode;
  }

  ngOnInit() {
    
  }

}
