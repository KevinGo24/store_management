export function controller_home() {
      const burger = document.querySelector(".burger-btn");
      const menu = document.querySelector("#menu");

      if (!burger || !menu) return;

      const icon = burger.querySelector("i");

      burger.addEventListener("click", () => {

            menu.classList.toggle("active");

            if (menu.classList.contains("active")) {
                  icon.classList.replace("bi-list", "bi-x-lg");
            } else {
                  icon.classList.replace("bi-x-lg", "bi-list");
            }

      });
}