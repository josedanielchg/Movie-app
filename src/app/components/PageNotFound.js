export function PageNotFound(data) {
     const d = document,
          $notFound = document.createElement("div"),
          $styles = document.getElementById("dynamic-styles"),
          $root = document.getElementById("root"),
          {
               title,
               message,
               backHome,
               tryAgain
          } = data;
     
     $root.removeChild(d.querySelector("footer"))

     $notFound.classList.add("not-found");

     $notFound.insertAdjacentHTML("beforeend", `
          <div class="error">
               <h2 class="title">${title}</h2>
               <div class="message">
                    <p>${message}</p>
                    ${backHome
                         ? `<p>Back to our <a href="${location.href}" class="back-home">home page</a>.</p>`
                         : "" 
                    }
                    ${tryAgain
                         ? `<p><a href="${location.href}" class="try-again">Try again</a>.</p>`
                         : "" 
                    }
               </div>
          </div>
     `)

     $styles.insertAdjacentHTML("beforeend", `
          .not-found {
               position: absolute;
               top: 0;
               bottom: 0;
               right: 0;
               left: 0;
               display: flex;
               flex-direction: column;
               align-items: center;
               justify-content: center;
               padding: 0.625rem;
               text-align: center;
          }

          .not-found .error {
               max-width: 450px;
          }

          .not-found .title {
               margin-top: 1rem;
               letter-spacing: 0.4px;
               font-size: 1.125rem;
          }

          .not-found .message {
               margin-top: 1rem;
          }

          .not-found .message p {
               margin-top: 1rem;
               font-size: 1.187rem;
               color: #666c70;
          }

          .not-found .message a {
               text-decoration: underline;
          }

          @media (min-width: 1024px) {
               .not-found .title {
                    font-size: 1.5rem;
               }
          }
     `);

     d.addEventListener("click", e => {
          if(!e.target.matches(".error a")) return false;
          e.preventDefault();

          if(e.target.matches(".back-home"))
               location.hash = "";

          if(e.target.matches(".try-again"))
               location.reload();
     })

     return $notFound;
}