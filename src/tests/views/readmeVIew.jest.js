/* eslint-env jest */

import React from "react";
import { mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import toJson from "enzyme-to-json";

import RenderReadme from "../../application/views/readmeView.jsx";

configure({ adapter: new Adapter() });

describe("README header renders correctly", function() {
    it("equals with snapshot", function() {
        expect(
            toJson(mount(<RenderReadme/>))
        ).toMatchSnapshot();
    });
});