import React, { useEffect, useState } from "react";

export const Products = () => {
  const [content, setContent] = useState(<ProductList showForm={showForm} />);

  function showList() {
    setContent(<ProductList showForm={showForm} />);
  }

  function showForm(product) {
    setContent(<ProductForm product={product} showList={showList} />);
  }
  return <div className="container my-5">{content}</div>;
};

function ProductList(props) {
  const [products, setProducts] = useState([]);

  function fetchProducts() {
    fetch("http://localhost:3004/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unexpected Server Response");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.log("Error: ", error));
  }

  useEffect(() => fetchProducts(), []);

  function deleteProduct(id) {
    fetch("http://localhost:3004/products/" + id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => fetchProducts());
  }

  return (
    <>
      <h2 className="text-center mb-3">List of Products</h2>
      <button
        onClick={() => props.showForm({})}
        type="button"
        className="btn btn-primary me-2"
      >
        Create +
      </button>
      <button
        onClick={() => fetchProducts()}
        type="button"
        className="btn btn-outline-primary"
      >
        Refresh
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Price</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => {
            return (
              <tr key={index}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td>{product.createdAt}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => props.showForm(product)}
                    type="button"
                    className="btn btn-primary btn-sm me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    type="button"
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function ProductForm(props) {
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    // read form data

    const formData = new FormData(e.target);

    // convert formData to object

    const product = Object.fromEntries(formData.entries());
    //form validation

    if (
      !product.name ||
      !product.brand ||
      !product.category ||
      !product.price
    ) {
      setErrorMessage(
        <div className="alert alert-warning" role="alert">
          Please provide all the required data!
        </div>
      );
      return;
    }

    if (props.product.id) {
      //update the product

      fetch("http://localhost:3004/products/" + props.product.id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not Ok");
          }
          return response.json();
        })
        .then((data) => props.showList())
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      // create a new product
      product.createdAt = new Date().toISOString().slice(0, 10);

      //sendin data to the server

      fetch("http://localhost:3004/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not Ok");
          }
          return response.json();
        })
        .then((data) => props.showList())
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  return (
    <>
      <h2 className="text-center mb-3">
        {props.product.id ? "Edit Product" : "Create New Product"}
      </h2>

      <div className="row ">
        <div className="col-lg-6 mx-auto shadow p-3 rounded-3">
          {errorMessage}
          <form onSubmit={(e) => handleSubmit(e)}>
            {props.product.id && (
              <div className="form-row mb-3">
                <div className="form-group col-sm-8">
                  <label htmlFor="id">ID</label>
                  <input
                    readOnly
                    type="text"
                    className="form-control-plaintext"
                    id="id"
                    name="id"
                    defaultValue={props.product.id}
                  />
                </div>
              </div>
            )}
            <div className="form-row mb-3">
              <div className="form-group col-sm-8">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  defaultValue={props.product.name}
                />
              </div>
            </div>

            <div className="form-row mb-3">
              <div className="form-group col-sm-8">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  className="form-control"
                  id="brand"
                  name="brand"
                  defaultValue={props.product.brand}
                />
              </div>
            </div>

            <div className="form-row mb-3">
              <div className="form-group col-sm-8">
                <label htmlFor="brand">Category</label>
                <select
                  name="category"
                  id="brand"
                  defaultValue={props.product.category}
                  className="form-control"
                >
                  <option value="Other">Other</option>
                  <option value="Phones">Phones</option>
                  <option value="Computers">Computers</option>
                  <option value="Accessories">Accessories</option>
                  <option value="GPS">GPS</option>
                  <option value="Cameras">Cameras</option>
                </select>
              </div>
            </div>

            <div className="form-row mb-3">
              <div className="form-group col-sm-8">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  defaultValue={props.product.price}
                />
              </div>
            </div>

            <div className="form-row mb-3">
              <div className="form-group col-sm-8">
                <label htmlFor="price">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  defaultValue={props.product.description}
                />
              </div>
            </div>

            <div className="row">
              <div className=" col-sm-4 d-grid">
                <button type="sumbit" className="btn btn-primary btn-sm me-3">
                  Save
                </button>
              </div>
              <div className="col-sm-4 d-grid">
                <button
                  onClick={() => props.showList()}
                  type="button"
                  className="btn btn-secondary me-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
