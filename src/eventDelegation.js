const containerElement = document.getElementById("container");

containerElement.innerHTML = `<div class="parent border border-red-300 flex flex-col gap-3 p-2">
    <div class="border border-black-300 text-center cursor-pointer" data-log="custom data for 1">
      1
    </div>
    <div class="border border-black-300 text-center cursor-pointer" data-log="custom data for 2">2</div>
    <div class="border border-black-300 text-center cursor-pointer" data-log="custom data for 3">3</div>
  </div>
`;

const parentElement = document.getElementsByClassName("parent")?.[0];

parentElement.addEventListener("click", (event) => {
  console.log("fn called", event.target.getAttribute("data-log"));
});
