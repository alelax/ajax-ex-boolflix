
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
         resetInput(thisInput);
         $('.film-list').html('');
         ajaxMoviesCall(thisInputVal);
         ajaxSeriesCall(thisInputVal);

      }
   });

   //Al click del button search recupero il contenuto dell'input
   //e invio una richiesta AJAX alla API TMDb.
   $('#search-btn').click(function(){
      thisInputVal = thisInput.val();
      resetInput(thisInput);
      //Cancello i risultati di una eventuale richiesta precedente
      $('.film-list').html('');
      ajaxMoviesCall(thisInputVal);
      ajaxSeriesCall(thisInputVal);
   });


   /* ***** FUNZIONI ***** */

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
            var moviesFromAPI = data.results;

            //Solo se il risutato della ricerca ha almeno un elemento verrà
            //stampato a video altrimenti comparirà un avviso di ricerca non
            //andata a buon fine
            if (moviesFromAPI.length > 0) {
               var movies = getMovies(moviesFromAPI);
               console.log(movies);
               showResults(movies);
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
            tvshowsFromAPI = dataSerie.results;

            //Solo se il risutato della ricerca ha almeno un elemento verrà
            //stampato a video altrimenti comparirà un avviso di ricerca non
            //andata a buon fine
            if (tvshowsFromAPI.length > 0) {
               var tvShows = getTvShows(tvshowsFromAPI);
               showResults(tvShows);
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


   function showResults(object) {
      for (var i = 0; i < object.length; i++) {

         var currentResult = object[i];
         var containerClass = "";
         var typeResultClass = "";

         //Se il titolo del film coincide con quello originale, il titolo verrà mostrato solo una volta
         if (currentResult.title == currentResult.original_title) {
            currentResult.original_title = "";
         }

         //Assgno la classe container nella quale verranno inseriti i film oppure quella in cui verrano
         //inserite le serieTv. Controllo che viene fatto in base al tipo di risultato corrente
         if (currentResult.type == "film") {
            containerClass = ".film-list";
            typeResultClass = "film";
         } else if (currentResult.type == "tvShow") {
            containerClass = ".series-list";
            typeResultClass = "serie";
         }

         //Inserisco nell'html tutti i dati di ogni singolo film trovato
         $(containerClass).append(
            "<div class='" + typeResultClass + "'>" +
               "<div class='poster-container'>" +
                  "<img src='https://image.tmdb.org/t/p/w342" + currentResult.poster + "'>" +
               "</div>" +
               "<div class='info'>" +
                  "<h1>" + currentResult.title + "</h1>" +
                  "<h2>" + currentResult.original_title + "</h2>" +
                  // Link a CountryFlagsAPI, restituisce la bandiera in base alla nazione passata
                  "<h3>" + getFlag(currentResult.original_language) + "</h3>" +
                  "<h4>" + currentResult.vote + "</h4>" +
                  "<div class='movie-stars'>" + getRating(currentResult.vote) + "</div>" +
               "</div>" +
            "</div>"
         );
      }
   }

   //Funzione che riceve un voto e restituisce un html con un numero di stelle gialle pari al voto
   function getRating(vote) {

      var html = '';

      //Trasfomo i voti decimali da 1 a 10 in un voto da 1 a 5
      var newVote = Math.floor(vote / 2);

      //Ciclo che assegna un numero di stelle pari al voto del film
      for (var i = 0; i < 5; i++) {
         //vengono aggiunte stelle gialle finchè j è minore del voto corrente
         //Per eventuali spazi restanti verranno aggiunte stelle vuote
         if (i < newVote) {
            html += "<i class='fa fa-star fa-lg' aria-hidden='true'></i>";
         } else {
            html += "<i class='fa fa-star-o fa-lg' aria-hidden='true'></i>";
         }
      }

      return html;

   }

   //Funzione che riceve la lingua del film e restiutisce un html con la corrispondente bandiera
   function getFlag(lang) {

      var html = '';
      //La bandiera del regno unito nell'API da cui viene recuperata è indicata con la sigla "gb"
      //mentre in themoviedb con "en". Per riuscire a mostrarla cambio la sigla
      if (lang == "en") {
         lang = "gb";
      }

      html += '<img src="http://www.countryflags.io/'+lang+'/flat/32.png" alt="'+lang+'"'+'>';

      return html;
   }

   function getMovies(moviesFromAPI) {

      var movies = [];

      for (var i = 0; i < moviesFromAPI.length; i++) {
         currentMovie = moviesFromAPI[i];

         movies[i] = {
            "title" : currentMovie.title,
            "original_title" : currentMovie.original_title,
            "original_language" : currentMovie.original_language,
            "vote" : currentMovie.vote_average,
            "poster" : currentMovie.poster_path,
            "type" : "film"
         };

      }
      return movies;
   }

   function getTvShows(tvshowsFromAPI) {

      var tvShows = [];

      for (var i = 0; i < tvshowsFromAPI.length; i++) {
         currentTvshow = tvshowsFromAPI[i];

         tvShows[i] = {
            "title" : currentTvshow.name,
            "original_title" : currentTvshow.original_name,
            "original_language" : currentTvshow.original_language,
            "vote" : currentTvshow.vote_average,
            "poster" : currentTvshow.poster_path,
            "type" : "tvShow"
         };

      }
      return tvShows;
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
