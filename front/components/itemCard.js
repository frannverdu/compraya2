export const itemCard = (item) => `
  <div class="card h-100">
    <img
        src="${item.image}"
        class="card-img-top shadow-lg"
    />
    <div class="card-body d-flex flex-column justify-content-end">
        <div class="d-flex justify-content-between mb-2">
        <h4 class="card-title">${item.name}</h4>
        <h5>$${item.price}</h5>
        </div>
        <p class="card-text mb-4">
        ${item.description}
        </p>
        <div class="row justify-content-between">
        <div class="col col-6 d-flex align-center">
            <input
             id="quantity-${item.id}"
            class="form-control form-control-sm"
            type="number"
            placeholder="Cantidad"
            min="0"
            value="1"
            />
        </div>
        <div class="col col-5 text-end">
            <button
            class="btn btn-outline-success btn-sm me-2 shadow-sm"
            id="btn-${item.id}"
            >
            Agregar al carro
            <i class="fa-solid fa-cart-plus fa-lg"></i>
            </button>
        </div>
        </div>
    </div>
  </div>
`;

export default itemCard;
