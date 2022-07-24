import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import React from "react";
import { configure, mount, render, shallow } from "enzyme";
import ReactDOM from "react-dom";
import Table from "./Table";

configure({ adapter: new Adapter() });
const catehandleChange = (event) => {};
describe("MyComponent", () => {
  it("Running successfully without any props", () => {
    const component = shallow(<Table />);

    expect(component).toMatchSnapshot();
  });
});

describe("Table component testing with fields ", () => {
  const wrapper = mount(<Table />);
  const table = wrapper.find("table");
  const row = table.find("tr");
  const header = table.find("th");


  it("table grid", () => {
    expect(table).toHaveLength(1);
    expect(row).toHaveLength(1);
    expect(header).toHaveLength(6);
  });
});

it("In my test case should create Table component without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Table />
   ,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
