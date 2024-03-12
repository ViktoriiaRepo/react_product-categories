/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable arrow-parens */
/* eslint-disable quotes */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from "react";
import "./App.scss";

import usersFromServer from "./api/users";
import categoriesFromServer from "./api/categories";
import productsFromServer from "./api/products";

function getUserById(userId) {
  return usersFromServer.find((user) => user.id === userId);
}

function getCategoryById(categoryId) {
  return categoriesFromServer.find((category) => category.id === categoryId);
}

const products = productsFromServer.map((product) => {
  const category = getCategoryById(product.categoryId);
  const user = getUserById(category.ownerId);

  return {
    id: product.id,
    name: product.name,
    category: ` ${category.icon ? category.icon : ""} - ${category.title}`,
    user: user.name,
    userSex: user.sex,
    userId: user.id,
  };
});

function getPreparedProducts(allProducts, filteredField) {
  let preparedProducts = [...allProducts];

  if (filteredField.query) {
    preparedProducts = preparedProducts.filter((product) => {
      const foundProduct = product.name
        .toLowerCase()
        .trim()
        .includes(filteredField.query.trim().toLowerCase());

      return foundProduct;
    });
  }

  if (filteredField.user !== "All") {
    preparedProducts = preparedProducts.filter(
      (product) => product.user === filteredField.user
    );
  }

  return preparedProducts;
}

// getUserById(1);
// getCategoryById(1);
// console.log(products);

export const App = () => {
  // const [selectedProducts, setSelectedProducts] = useState([]);
  const [filteredField, setFilteredField] = useState({
    query: "",
    user: "All",
  });

  const visibleProducts = getPreparedProducts(products, filteredField);

  const handleInputChange = (event) => {
    const { value } = event.target;

    setFilteredField({ ...filteredField, query: value });
  };

  const clearInput = () => {
    setFilteredField({ ...filteredField, query: "" });
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={filteredField.user === "All" ? "is-active" : ""}
                onClick={() => setFilteredField({ query: "", user: "All" })}
              >
                All
              </a>
              {usersFromServer.map((user) => (
                <a
                  key={user.id}
                  onClick={() =>
                    setFilteredField({ ...filteredField, user: user.name })
                  }
                  data-cy={`FilterUser${user.id}`}
                  href="#/"
                  className={
                    filteredField.user === user.name ? "is-active" : ""
                  }
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  value={filteredField.query}
                  onChange={handleInputChange}
                  placeholder="Search"
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {filteredField.query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete is-small"
                      onClick={clearInput}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a data-cy="Category" className="button mr-2 my-1" href="#/">
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a data-cy="Category" className="button mr-2 my-1" href="#/">
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length !== 0 ? (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map((product) => (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>
                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{product.category}</td>
                    <td
                      data-cy="ProductUser"
                      className={
                        product.userSex === "m"
                          ? "has-text-link"
                          : "has-text-danger"
                      }
                    >
                      {product.user}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
