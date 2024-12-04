const Name = document.getElementById("name");

const Price = document.getElementById("price");

const Discount = document.getElementById("discount");

const Element_Count = document.getElementById("count");

const Category = document.getElementById("category");

const Search = document.getElementById("search");

const Create = document.getElementById("create");

const Total = document.querySelector(".total-price");

function CheckProductName(val) {
  let default_Val = "Unknown";
  const range = /\b[a-z]+[\s-_]?[0-9]*\b/i;
  return range.test(val.trim()) ? val : default_Val;
}

function CheckTheAmount(val) {
  let default_Val = 0;

  if (parseFloat(val) <= default_Val || val.trim() === "") {
    return default_Val;
  } else {
    return parseFloat(val).toFixed(2);
  }
}

function Check_Discount(val, Price) {
  return val > Price ? (0).toFixed(2) : Number(val).toFixed(2);
}

class Product_info {
  constructor(Name, Price, Discount, Category) {
    this.product_Name = CheckProductName(Name);
    this.product_Price = CheckTheAmount(Price) || 0;
    this.product_Discount =
      Check_Discount(Discount, parseInt(this.product_Price)) || 0;
    this.Total_Price = (Price - Discount).toFixed(2);
    this.Category = CheckProductName(Category);
  }
  change_val(Name, price, discount, category) {
    this.product_Name = Name || "Unknown";
    this.product_Price = !isNaN(parseFloat(price))
      ? Number(price).toFixed(2)
      : (0).toFixed(2);
    this.product_Discount = !isNaN(parseFloat(discount))
      ? Number(discount).toFixed(2)
      : (0).toFixed(2);
    this.Category = category || "Unknown";

    this.Total_Price = Number(
      this.product_Price - this.product_Discount
    ).toFixed(2);
  }
}

const Tbody = document.querySelector("tbody");

const up = "Update",
  del = "Delete";

function create_elements(arr) {
  Tbody.innerHTML = "";
  arr.forEach((element, i) => {
    const Info = `<tr>
    <td>${(element.id = i + 1)}</td>
    <td class="name">${element.product_Name}</td>
    <td class="price">${element.product_Price}</td>
    <td class="discount">${element.product_Discount}</td>
    <td>${element.Total_Price}</td>
    <td class="category">${element.Category}</td>
    <td class="update"><button>${up}</button></td>
    <td class="delete"><button>${del}</button></td>
    </tr>`;
    Tbody.innerHTML += Info;
    localStorage.setItem("Products", JSON.stringify(arr));
  });
  upDate();
  Remove(arr);
}

function Ch_Times() {
  let Times = 1;
  return (Times =
    Element_Count.value === ""
      ? Times
      : Times < parseInt(Element_Count.value)
      ? parseInt(Element_Count.value)
      : 1);
}

let Products = localStorage.getItem("Products")
  ? JSON.parse(localStorage.getItem("Products"))
  : [];

function re() {
  const Body = document.querySelector("tbody").children;
  let children = Array.from(Body);
  return children;
}

function rede() {
  const inputs = document.querySelectorAll("input");
  Total.textContent = (0).toFixed(2);
  inputs.forEach((input) => {
    input.value = "";
  });
}

Create.addEventListener("click", () => {
  let Count = Ch_Times();
  for (let i = 0; i < Count; i++) {
    Products.push(
      new Product_info(Name.value, Price.value, Discount.value, Category.value)
    );
  }
  create_elements(Products);
  rede();
});

Price.addEventListener("input", function () {
  Total.textContent = Number(this.value).toFixed(2);
});

Discount.addEventListener("input", function () {
  if (Price.value.trim() === "") {
    Total.textContent = (0).toFixed(2);
  } else if (+Price.value > +this.value && +this.value >= 0) {
    Total.textContent = Number(Price.value - +this.value).toFixed(2);
  } else {
    Total.textContent = (0).toFixed(2);
  }
});

function Remove(arr) {
  let Tr_s = re();
  Tr_s.forEach((elm) => {
    let button = elm.lastElementChild.firstElementChild;
    button.addEventListener("click", () => {
      arr = arr.filter(
        (e) => e.id !== parseInt(elm.firstElementChild.textContent)
      );
      elm.remove();
      Products = arr;
      localStorage.setItem("Products", JSON.stringify(Products));
      create_elements(Products);
    });
  });
}

Search.addEventListener("input", function () {
  const value = this.value;
  const reg = new RegExp(value, "i");
  const Tr = Array.from(document.querySelector("tbody").children);
  Tr.forEach((parent) => {
    const Title = parent.children[1].textContent;
    !reg.test(Title)
      ? parent.classList.add("di")
      : parent.classList.remove("di");
  });
});

function upDate() {
  const up_children = Array.from(document.querySelectorAll(".update"));
  const inputs = Array.from(document.querySelectorAll(".i"));

  const Up_button = document.querySelector(".change");
  let position = 0;

  up_children.forEach((parent) => {
    parent.firstElementChild.addEventListener("click", function () {
      Up_button.classList.toggle("di");
      Create.classList.toggle("di");

      position = Number(parent.parentElement.firstElementChild.textContent);

      const Tr_parent = Array.from(parent.parentElement.children)
        .slice(1, 6)
        .filter((td) => td.hasAttribute("class"));

      inputs.forEach((input, i) => {
        input.value = Tr_parent[i].textContent;
      });
      Total.textContent = parent.parentElement.children[4].textContent;
    });
  });

  Up_button.addEventListener("click", function () {
    Up_button.classList.toggle("di");
    Create.classList.toggle("di");

    const row = document.querySelector(`tbody tr:nth-child(${position})`);

    Products.forEach((elm, i) => {
      if (elm.id === position) {
        Object.setPrototypeOf(elm, Product_info.prototype);
        elm.change_val(
          inputs[0].value,
          inputs[1].value,
          inputs[2].value,
          inputs[3].value
        );
        const cells = row.children;
        cells[1].textContent = elm.product_Name;
        cells[2].textContent = elm.product_Price;
        cells[3].textContent = elm.product_Discount;
        cells[4].textContent = elm.Total_Price;
        cells[5].textContent = elm.Category;
      }
    });
    localStorage.setItem("Products", JSON.stringify(Products));
    rede();
  });
}

if (localStorage.getItem("Products")) {
  let Store = JSON.parse(localStorage.getItem("Products"));
  create_elements(Store);
}
