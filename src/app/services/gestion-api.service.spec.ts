import { TestBed } from '@angular/core/testing';
import { GestionApiService } from './gestion-api.service';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RespuestaNoticias } from '../interfaces/interfaces';
import { HttpHeaderResponse } from '@angular/common/http';

describe('GestionApiService', () => {
  //Inicializaremos el servicio
  let service: GestionApiService;
  //Necesitaremos un mock para sustituir el HttpCliente
  let httpMock: HttpTestingController;
  //Habrá que import los modulos necesarios, como por ejemplo para simular HttpClient
  beforeEach(() => {
    TestBed.configureTestingModule({
      //importamos el httpClienteTestingModule (OJO, no importamos httpClient)
      imports:[HttpClientTestingModule],
      //En providers añadimos el servicio que vamos a utilizar
      providers: [GestionApiService]
    });
    //Inyectamos el servicio al TestBed
    service = TestBed.inject(GestionApiService);
    //Inyectamos el httpTestingController al TestBed
    httpMock = TestBed.inject(HttpTestingController);
  });

  //afterEach, verificamos httpMock que no queden respuestas pendientes
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //Simulamos sin ejecutar la lógica a ver si podemos llamar al método cargarCategoria
  it("Comprobar si podemos llamar al método cargarCategoria", () => {
    spyOn(service, 'cargarCategoria');
    let categoria: string = 'unaCategoria' 
    service.cargarCategoria(categoria);
    expect(service.cargarCategoria).toHaveBeenCalledWith(categoria);
  });
  

  //
  it('Debería cargar los datos en el BehaviorSubject correctamente', () => {
    const categoria = 'business';
    //Necesitaremos un mock de tipo RespuestasNoticias para simular la respuesta del servidor 
    let mockResponse : RespuestaNoticias;
    mockResponse = {
          status: "ok",
          totalResults: 2,
          articles: [
            {
              source: {id: '', name: 'CNBC'},
              author:	"Pia Singh, Hakyung Kim",
              title: "Dow drops 300 points as investors await trade deals, Fed decision: Live updates - CNBC",
              description: "Stocks slipped Tuesday after President Donald Trump walked back on promises that trade deals are on the horizon, saying 'we don't have to sign deals.'",
              url: "https://www.cnbc.com/2025/05/05/stock-market-today-live-updates.html",
              urlToImage: "https://image.cnbcfm.com/api/v1/image/108141611-1746543922380-gettyimages-2213149338-AFP_44N629G.jpeg?v=1746543978&w=1920&h=1080",
              publishedAt: "2025-05-06T18:33:00Z",
              content: "Stocks slipped Tuesday after President Donald Trump's shaky commentary on global trade deals, dashing hopes that progress will soon be made on the tariff front. Investors also await the Federal Reser… [+2767 chars]",
            },
            {
              source: {id: 'plitico', name: 'Politico'},
              author: "Jasper Goodman",
              title: "Dems split over Waters’ crypto hearing maneuver - Politico",
              description: "House Financial Services ranking member Maxine Waters and other panel Democrats convened a separate 'shadow hearing.'",
              url: "https://www.politico.com/live-updates/2025/05/06/congress/democrats-crypto-congress-waters-financial-services-00330881",
              urlToImage: "https://www.politico.com/dims4/default/6873124/2147483647/resize/1200x/quality/90/?url=https%3A%2F%2Fstatic.politico.com%2F01%2Fc0%2F81d8bb8b4e7686ce9cc1a7ab81c6%2Fu-s-congress-80997.jpg",
              publishedAt: "2025-05-06T17:49:00Z",
              content: '',
            }
            ],
    };
    //Ejecutamos la lógica de cargarCategoria para testear que el BehaviorSuject funciona correctamente
    service.cargarCategoria(categoria);

    //Simulamos una llamada API y esperamos una respuesta y que sea de tipo GET
    //Recordar que hacemos uso de HttpTestingController, no de httpClient, por tanto, estamos simulando la llamada API.
    //Necesitaremos apiKey de cada uno. 
    //IMPORTANTE MODIFICAR EL APIKEY EN LA CARPETA ENVIRONMENTS
    const respuesta = httpMock.expectOne("https://newsapi.org/v2/top-headlines?country=us&category=" + categoria + "&apiKey=" + service.apiKey);
    expect(respuesta.request.method).toBe('GET');

    //Simulamos que la respuesta del servidor sea nuestro mockResponse (flush)
    respuesta.flush(mockResponse);

    //datos$ tendría que modificarse con los datos simulados (categoria=business y totalResults=2), por tanto data contendrá esos datos.
    //Aquí habrá que hacer el subscribe de datos$, y comprobaremos que data esté definido y que data.categoria y data.totalResults son iguales a nuestra categoria y totalResults
    service.datos$.subscribe(data => {
      expect(data).toBeDefined();
      expect(data?.categoria).toBe(categoria);
      expect(data?.totalResults).toBe(mockResponse.totalResults);
    });
  });
});
