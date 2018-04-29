// 4283f11a-0c36-490a-a135-7df8f7c954d4

/* Film requested HTML structure */
var   posterBoxO = "<div class='poster-container'>",
         infoBoxO = "<div class='info hidden'>",
            titleO = "<h1 class='title'>",
            titleC = "</h1>",
            origTitleO = "<h2 class='original-title'><span class='structure'>Original title: </span>",
            origTitleC = "</h2>",
            langOpen = "<h3>",
            langClose = "</h3>",
            langLiteralO = "<span class='structure'>Language: ",
            langLiteralC = " - </span>",
            langFlagO = "<span class='flag'>",
            langFlagC = "</span>",
            voteO = "<div> <span class='structure'>Vote: </span>",
            voteNumberO = "<span class='vote-number'>  ",
            voteNumberC = "</span>"
            voteC = "</div>",
            posterImageO = "<img src='https://image.tmdb.org/t/p/w342",
            posterImageC = "'>",
         infoBoxC = "</div>",
      posterBoxC = "</div>"
       ;

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

         //Cancello i risultati di una eventuale richiesta precedente
         resetList('.film-list', "Film");
         resetList('.series-list', "Serie TV");

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
      resetList('.film-list', "Film");
      resetList('.series-list', "Serie TV");

      ajaxMoviesCall(thisInputVal);
      ajaxSeriesCall(thisInputVal);
   });

   //Le info del film vengo visualizzate passando sulla copertina del film
   //e  nascoste uscendo da
   // $(document).on('mouseenter mouseleave', '.film', function(){
   //    $(this).find('.overlay').fadeToggle(500);
   //    $(this).find('.info').fadeToggle(500);
   //    $(document).on('mouseenter mouseleave', '.info', function(){
   //       $(this).children('.overview').fadeToggle(500);
   //    });
   // });
   $(document).on('mouseenter mouseleave', '.film', function(){
      $(this).find('.overlay').fadeToggle(500);
      $(this).find('.info').fadeToggle(500);
      $(this).find('.info').on({
         mouseenter : function(){
            $(this).find('.overview').fadeIn(500);
         },
         mouseleave : function(){
            $(this).find('.overview').fadeOut(500);
         }
      });
   });

   $(document).on('mouseenter mouseleave', '.serie', function(){
      $(this).find('.overlay').fadeToggle(500);
      $(this).find('.info').fadeToggle(500);
      $(this).find('.info').on({
         mouseenter : function(){
            $(this).find('.overview').fadeIn(500);
         },
         mouseleave : function(){
            $(this).find('.overview').fadeOut(500);
         }
      });
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
      for (var i = 0; i < object.length ; i++) {

         var currentResult = object[i];
         var containerClass = "";
         var typeResultClass = "";

         //Se il titolo del film coincide con quello originale, il titolo verrà mostrato solo una volta
         if (currentResult.title == currentResult.original_title) {
            currentResult.original_title = "---";
         }

         //Se l'overview non è presente stampo un messaggio di avviso
         if (currentResult.overview == "") {
            currentResult.overview = "Overview is not available";
         }

         //Se il poster non è presente inserisco un immagine di default
         var posterImageTemp = "";
         if (currentResult.poster == null) {
            posterImageTemp = "<img src='png/movie-poster-coming-soon.png";
         } else {
            posterImageTemp = posterImageO + currentResult.poster;
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
               posterBoxO +
                  posterImageTemp + posterImageC +

                  infoBoxO +
                     "<div class='overview'>" + /* "<span class='structure'>Overview: </span>" + */ currentResult.overview + "</div>" +
                     // Link a CountryFlagsAPI, restituisce la bandiera in base alla nazione passata
                     langOpen + langLiteralO + currentResult.original_language + langLiteralC + langFlagO + getFlag(currentResult.original_language) + langFlagC + langClose +
                     voteO + getRating(currentResult.vote) + voteNumberO + currentResult.vote + voteNumberC + voteC +
                     origTitleO + currentResult.original_title + origTitleC +
                     titleO + currentResult.title + titleC +
                  infoBoxC +

                  "<div class='overlay'></div>" +
               posterBoxC+
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
      if (lang == "ja") {
         lang = "jp";
      }

      html += '<img src="http://www.countryflags.io/'+lang+'/flat/24.png">';

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
            "overview" : currentMovie.overview,
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
            "overview" : currentMovie.overview,
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

   //Funzione che prende in ingresso i la sezione da resettare e il tipo di sezione
   //Ad ogni nuova chiamata pulisce la pagina dai risultati precedenti.
   function resetList(classList, section) {
      $(classList).html('').append(
         '<div class="type-header">'+section+"</div>"
      );
   }
});
