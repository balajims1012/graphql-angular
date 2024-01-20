import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map, of } from 'rxjs';
import { Fruits } from '../fruits';
import { GET_Fruits } from '../gql/fruits-query.ts';
import { DELETE_Fruit } from '../gql/fruits-mutation';

declare var window : any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private apollo: Apollo) {}

  allFruits$: Observable<Fruits[]> = of([]);

  deleteModal : any;
  idToDelete: number = 0;

  ngOnInit(): void {

    this.deleteModal= new window.bootstrap.Modal(
      document.getElementById('deleteModal')
    )

    this.allFruits$ = this.apollo
      .watchQuery<{ allFruits: Fruits[] }>({ query: GET_Fruits })
      .valueChanges.pipe(map((result) => result.data.allFruits));
  }

  openConfirmationModal(id: number){
    this.idToDelete = id;
    this.deleteModal.show();
  }

  delete(){
    this.apollo
      .mutate<{ removeFruit: Fruits }>({
        mutation: DELETE_Fruit,
        variables: {
          id: this.idToDelete
        },
        update: (store, { data }) => {
          if (data?.removeFruit) {
            var allData = store.readQuery<{ allFruits: Fruits[] }>({
              query: GET_Fruits,
            });
            if(allData && allData?.allFruits.length > 0){
              var newData: Fruits[] = [...allData.allFruits];
              newData = newData.filter(_ => _.id !== data.removeFruit.id);

              store.writeQuery<{allFruits: Fruits[]}>({
                query: GET_Fruits,
                data: {allFruits:newData}
              })
            }
          }
        },
      })
      .subscribe(({ data }) => {
        this.deleteModal.hide();
      });
  }
}
