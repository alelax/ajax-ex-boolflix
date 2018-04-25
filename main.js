
/* Film requested HTML structure */
var filmDivOpen = "<div class='film'>",
      fTitleOpen = "<h1>",
      fTitleClose = "</h1>",
      fOriginalTitleOpen = "<h2>",
      fOriginalTitleClose = "</h2>",
      fOriginalLanguageOpen = "<h3>",
      fOriginalLanguageClose = "</h3>",
      fVoteOpen = "<h4>",
      fVoteClose = "</h4>"
    filmDivClose = "</div>";

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
      ajaxCall(thisInputVal);
   });


   //Funziona che inoltra la chiamata AJAX. Il parametro ricevuto in ingresso
   //è il valore recuperato dal campo input
   function ajaxCall(inputVal) {
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
               for (var i = 0; i < data.results.length; i++) {
                  var currentFilm = data.results[i];

                  if (currentFilm.title == currentFilm.original_title) {
                     currentFilm.original_title = "";
                  }

                  $('.film-list').append(
                     filmDivOpen +
                        fTitleOpen + currentFilm.title + fTitleClose +
                        fOriginalTitleOpen + currentFilm.original_title + fOriginalTitleClose +
                        fOriginalLanguageOpen + currentFilm.original_language + fOriginalLanguageClose +
                        fVoteOpen + currentFilm.vote_average + fVoteClose +
                     filmDivClose
                  );
               }
            } else {
               $('.film-list').append(
                  "<div class='film'>" +
                     "<h2>" + "Non è stato trovato nessun film" + "</h2>" +
                  "</div>"
               );

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
});
