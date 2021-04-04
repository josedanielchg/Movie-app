export function Footer() {

     const $footer = document.createElement("footer"),
          URL_TMDb_LOGO = "https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg";
          
     $footer.classList.add("footer");

     $footer.innerHTML = `
          <img src="${URL_TMDb_LOGO}" alt="TMDb logo" class="TMDb-logo" style="width: 150px">
          <p class="attribution">
               This product uses the TMDb API but is not endorsed or certified by TMDb
          </p>
     `;

     return $footer
}