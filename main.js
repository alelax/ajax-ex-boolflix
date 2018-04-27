
/* Film requested HTML structure */
// var filmDivOpen = "<div class='film'>",
//       fTitleOpen = "<h1>",
//       fTitleClose = "</h1>",
//       fOriginalTitleOpen = "<h2>",
//       fOriginalTitleClose = "</h2>",
//       fOriginalLanguageOpen = "<h3>",
//       fOriginalLanguageClose = "</h3>",
//       fVoteOpen = "<h4>",
//       fVoteClose = "</h4>",
//       fStarOpen = "<div class='stars'>",
//          starsEmpty = "<i class='fa fa-star-o fa-lg' aria-hidden='true'></i>",
//          starsFill = "<i class='fa fa-star fa-lg' aria-hidden='true'></i>",
//       fStarClose = "</div>",
//     filmDivClose = "</div>";

// 4283f11a-0c36-490a-a135-7df8f7c954d4
$(document).ready(function(){

   //Salvo in una variabile l'oggetto input
   var thisInput = $('#search-input');
   resetInput(thisInput);
   var thisInputVal = "";

   //Chiamata AJAX alla pressione del tasto Enter
   $('#search-input').keypress(function(e) {
      //13 = Tasto invio
      if (e.which == 13) {
         thisInputVal = thisInput.val();
         console.log(thisInputVal);
         ajaxCall(thisInputVal);
      }
   });

   //Al click del button search recupero il contenuto dell'input
   //e invio una richiesta AJAX alla API TMDb.
   $('#search-btn').click(function(){
      thisInputVal = thisInput.val();
      console.log(thisInputVal);
      resetInput(thisInput);
      //Cancello i risultati di una eventuale richiesta precedente
      $('.film-list').html('');
      ajaxMoviesCall(thisInputVal);

      $('.series-list').html('');
      ajaxSeriesCall(thisInputVal);
   });


   //Funziona che inoltra la chiamata AJAX. Il parametro ricevuto in ingresso
   //è il valore recuperato dal campo input
   function ajaxMoviesCall(inputVal) {
      $.ajax({
         url : "https://api.themoviedb.org/3/search/movie",
         method : "GET",
         data : {
            api_key : "eb256750e09137c9565156e96a6e8ce1",
            query : inputVal,
            language : "it-IT"
         },
         success : function(data){
            console.log(data);

            //Solo se il risutato della ricerca ha almeno un elemento verrà
            //stampato a video altrimenti comparirà un avviso di ricerca non
            //andata a buon fine
            if (data.results.length > 0) {
               showMovies(data);
            } else {
               showNoResults("film-list");
            }
         },
         error : function(e){
            console.log(e);
         },
      });
   }

   function ajaxSeriesCall(inputVal) {
      $.ajax({
         url : "https://api.themoviedb.org/3/search/tv",
         method : "GET",
         data : {
            api_key : "eb256750e09137c9565156e96a6e8ce1",
            query : inputVal,
            language : "it-IT"
         },
         success : function(dataSerie){
            console.log(dataSerie);
            showSeries(dataSerie);
            //Solo se il risutato della ricerca ha almeno un elemento verrà
            //stampato a video altrimenti comparirà un avviso di ricerca non
            //andata a buon fine
            if (dataSerie.results.length > 0) {

               //showMovies(data);
            } else {
               showNoResults("series-list");
            }
         },
         error : function(e){
            console.log(e);
         },
      });
   }



   //Funzione per il reset dell'input
   function resetInput(inputField) {
      inputField.val('');
   }

   //Funzione che mostra tutti i risultati corrispondenti alla ricerca fatta
   function showMovies(movies) {

      for (var i = 0; i < movies.results.length; i++) {
         var currentFilm = movies.results[i];

         //Se il titolo del film coincide con quello originale, il titolo verrà mostrato solo una volta
         if (currentFilm.title == currentFilm.original_title) {
            currentFilm.original_title = "";
         }

         //La bandiera del regno unito nell'API da cui viene recuperata è indicata con la sigla "gb"
         //mentre in themoviedb con "en". Per riuscire a mostrarla cambio la sigla
         if (currentFilm.original_language == "en") {
            currentFilm.original_language = "gb";
         }

         //Inserisco nell'html tutti i dati di ogni singolo film trovato
         $('.film-list').append(
            "<div id=" + currentFilm.id + " class='film'>" +
               "<div class='film-container'>" +
                  "<img src='https://image.tmdb.org/t/p/w342" + currentFilm.poster_path + "'>" +
               "</div>" +
               "<div class='info'>" +
                  "<h1>" + currentFilm.title + "</h1>" +
                  "<h2>" + currentFilm.original_title + "</h2>" +
                  "<h3>" +
                     // Link a CountryFlagsAPI, restituisce la bandiera in base alla nazione passata
                     '<img src="http://www.countryflags.io/'+currentFilm.original_language+'/flat/32.png" alt="' + currentFilm.original_language + '"' + '>' +
                  "</h3>" +
                  "<h3>" + currentFilm.vote_average + "</h3>" +
                  "<div class='stars'>"
         );

         //Trasfomo i voti decimali da 1 a 10 in un voto da 1 a 5
         var vote = Math.round(currentFilm.vote_average / 2);

         //Ciclo che assegna un numero di stelle pari al voto del film
         for (var j = 0; j < 5 ; j++) {
            //vengono aggiunte stelle gialle finchè j è minore del voto corrente
            //Per eventuali spazi restanti verranno aggiunte stelle vuote
            if (j < vote) {
               $('#'+currentFilm.id).children('.stars').append(
                  "<i class='fa fa-star fa-lg' aria-hidden='true'></i>"
               );
            } else {
               $('#'+currentFilm.id).children('.stars').append(
                  "<i class='fa fa-star-o fa-lg' aria-hidden='true'></i>"
               );
            }
         }

         $('.film-list').append(
               "</div>" + "</div>" + "</div>"
         );
      }
   }

   function showSeries(series) {

      for (var i = 0; i < series.results.length; i++) {
         var currentSeries = series.results[i];

         //Se il titolo del film coincide con quello originale, il titolo verrà mostrato solo una volta
         if (currentSeries.title == currentSeries.original_title) {
            currentSeries.original_title = "";
         }

         //La bandiera del regno unito nell'API da cui viene recuperata è indicata con la sigla "gb"
         //mentre in themoviedb con "en". Per riuscire a mostrarla cambio la sigla
         if (currentSeries.original_language == "en") {
            currentSeries.original_language = "gb";
         }

         //Inserisco nell'html tutti i dati di ogni singolo film trovato
         $('.series-list').append(
            "<div id=" + currentSeries.id + " class='serie'>" +
               "<div class='poster-container'>" +
                  "<img src='https://image.tmdb.org/t/p/w342" + currentSeries.poster_path + "'>" +
               "</div>" +
               "<div class='info'>" +
                  "<h1>" + currentSeries.name + "</h1>" +
                  "<h2>" + currentSeries.original_name + "</h2>" +
                  "<h3>" +
                     // Link a CountryFlagsAPI, restituisce la bandiera in base alla nazione passata
                     '<img src="http://www.countryflags.io/'+currentSeries.original_language+'/flat/32.png" alt="' + currentSeries.original_language + '"' + '>' +
                  "</h3>" +
                  "<h3>" + currentSeries.vote_average + "</h3>" +
                  "<div class='stars'>"
         );

         //Trasfomo i voti decimali da 1 a 10 in un voto da 1 a 5
         var vote = Math.round(currentSeries.vote_average / 2);

         //Ciclo che assegna un numero di stelle pari al voto del film
         for (var j = 0; j < 5 ; j++) {
            //vengono aggiunte stelle gialle finchè j è minore del voto corrente
            //Per eventuali spazi restanti verranno aggiunte stelle vuote
            if (j < vote) {
               $('#'+currentSeries.id).children('.stars').append(
                  "<i class='fa fa-star fa-lg' aria-hidden='true'></i>"
               );
            } else {
               $('#'+currentSeries.id).children('.stars').append(
                  "<i class='fa fa-star-o fa-lg' aria-hidden='true'></i>"
               );
            }
         }

         $('.film-list').append(
               "</div>" + "</div>" + "</div>"
         );
      }

   }
   //Se la ricerca non produce risultati verrà notificato tramite questa funzione
   function showNoResults(className) {
      $('.' + className).append(
         "<div class='film'>" +
            "<h2>" + "La ricerca non ha prodotto risultati" + "</h2>" +
         "</div>"
      );
   }
});
