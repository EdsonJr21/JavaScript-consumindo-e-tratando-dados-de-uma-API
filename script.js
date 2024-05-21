const containerVideos = document.querySelector(".videos__container");

async function mostrarVideos() {
  try {
    const api = await fetch("http://localhost:3000/videos");
    const videos = await api.json();

    videos.forEach((video) => {
      if (video.categoria == ""){
        throw new Error("Vídeo não tem categoria");
      }

      const li = document.createElement("li");
      li.className = "videos__item";

      const iframe = document.createElement("iframe");
      iframe.width = "560";
      iframe.height = "315";
      iframe.src = `https://www.youtube.com/embed/${getVideoIdFromUrl(video.url)}`;
      iframe.title = video.titulo;
      iframe.frameBorder = "0";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;

      li.appendChild(iframe);

      const descricaoDiv = document.createElement("div");
      descricaoDiv.className = "descricao-video";
      descricaoDiv.innerHTML = `
        <img class="img-canal" src="${video.imagem}" alt="Logo do Canal">
        <h3 class="titulo-video">${video.titulo}</h3>
        <p class="views-canal">${video.descricao}</p>
        <p class="categoria" hidden>${video.categoria}</p>
      `;

      li.appendChild(descricaoDiv);
      containerVideos.appendChild(li);
    });
  } catch (error) {
    containerVideos.innerHTML = `<p>Houve um erro ao carregar os vídeos: ${error}</p>`;
  }
}

mostrarVideos();

const barraDePesquisa = document.querySelector(".pesquisar__input");

barraDePesquisa.addEventListener("input", filtrarPesquisa);

function filtrarPesquisa() {
  const videos = document.querySelectorAll(".videos__item");
  const valorFiltro = barraDePesquisa.value.toLowerCase();

  videos.forEach(video => {
    const titulo = video.querySelector(".titulo-video").textContent.toLowerCase();
    video.style.display = titulo.includes(valorFiltro) ? "block" : "none";
  });
}

const botaoCategoria = document.querySelectorAll(".superior__item");

botaoCategoria.forEach((botao) => {
  let nomeCategoria = botao.getAttribute("name");
  botao.addEventListener("click", () => filtrarPorCategoria(nomeCategoria));
});

function filtrarPorCategoria(filtro){
  const videos = document.querySelectorAll(".videos__item");
  for(let video of videos){
    let categoria = video.querySelector(".categoria").textContent.toLowerCase();
    let valorFiltro = filtro.toLowerCase();
      
    if(!categoria.includes(valorFiltro) && valorFiltro !== 'tudo'){
      video.style.display = "none";
    } else {
      video.style.display = "block";
    }
  }
}

function getVideoIdFromUrl(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|\/embed\/|\/v\/|\/e\/|youtu\.be\/)?([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
