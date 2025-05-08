import { GestionApiService } from './../../services/gestion-api.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BarChartComponent } from './bar-chart.component';
//import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  //Será un array de un objeto que contenga categoria y totalResults, estará inicializado a un array vacío.
  let mockApiData: { categoria: string; totalResults: number }[] = []; /*Inicializar variable*/

  // Declara un BehaviorSubject falso para usar en las pruebas. Asignar un valor inicial al objeto que contiene categoria y totalResults.
  const fakeSubject : BehaviorSubject<{ categoria: string; totalResults: number }|undefined> = new BehaviorSubject<{ categoria: string; totalResults: number }|undefined>({ categoria: 'sports', totalResults: 12 }); /*Inicializar variable*/

  //Creamos un mock para sustituir GestionApiService. 
  //Contiene un método cargarCategoria que recibe un string categoria y no devulve nada.
  const mockGestionService: {
    cargarCategoria: (categoria: string)=> void ;
  } = {
    cargarCategoria: (categoria: string) => {}
  }; /*Inicializar variable*/

  //Necesitamos añadir el sustituto de HttpClient
  //De providers, como sustituiremos GestionApiService, como useValue, necesitaremos añadir {datos$: fakeSubject, mockGestionService}
  //En este caso, cuando queremos hacer uso de GestionApiService, estaremos haciendo uso de mockGestionService y fakeSubject
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartComponent ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [
        { 
          provide: GestionApiService,
          useValue: {datos$: fakeSubject, mockGestionService}
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Comprobamos si podemos ejecutar el método ngOnInit
  //No se ejecuta la lógica del ngOnInit
  it('Se puede ejecutar ngOnInit', () => {
    spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  //Comprobamos si podemos ejecutar el método ngOnInit
  //Se ejecuta la lógica de ngOnInit
  it('El método ngOnInit se ejecuta correctamente', () => {
    spyOn(component, 'inicializarChart');

    component.ngOnInit();

    expect(component.inicializarChart).toHaveBeenCalled();
  });

  //Necesitaremos 2 espías uno por cada método
  //Usaremos un mockData, será un objeto que contenga un valor de categoria y totalResults
  //Haremos uso de fakeSubject (el fake BehaviorSubject). Simularemos el next de este BehaviorSubject pasándole el mockData

  it('Comprobamos si podemos llamar a actualizarValoresChart y actualizarChart', () => {
    spyOn(component, 'actualizarChart');
    spyOn(component, 'actualizarValoresChart');

    let mockData : { categoria: string, totalResults: number } = ({ categoria: 'science', totalResults: 15 });
    fakeSubject.next(mockData);

    expect(component.actualizarChart).toHaveBeenCalled();
    expect(component.actualizarValoresChart).toHaveBeenCalledWith('science', 15);
  });

  //Cargaremos el mockApiData de valores e inicializaremos la variable apiData del componente con este mockApiData (No asignar todos los valores)
  //Crearemos un mockData, con los datos de categoria y totalResults que no existen en el mockApiData, para pasar estos valores al método actualizarValoresChart
  //Si el método actualizarValoresChart, se ha ejecutado correctamente, mediante el método find, podemos comprobar a ver si los valores de mockData se han insertado en component.apiData
  //Al hacer uso de .find, devolverá el objeto encontrado, los que hemos puesto en mockData.
  //Por tanto, esperamos que ese objeto devuelto exista y que el valor totalResults sea igual al totalResults de mockData
  it('Comprobamos si podemos ejecutar actualizarValoresChart', () => {
    mockApiData.push({categoria: 'sports', totalResults: 10},
       {categoria: 'science', totalResults: 11},
    );
    component.apiData = mockApiData;
    let mockData : { categoria: string, totalResults: number } = ({ categoria: 'musica', totalResults: 9});
    component.actualizarValoresChart(mockData.categoria, mockData.totalResults);
    let objeto = component.apiData.find(({categoria})=> categoria === mockData.categoria);
    expect(objeto?.totalResults).toBe(mockData.totalResults);
    expect(objeto).toEqual(mockData);

  });
});
