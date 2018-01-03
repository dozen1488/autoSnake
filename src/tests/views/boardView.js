/* eslint-env jest */

import React from "react";
import { configure, shallow, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import renderer from 'react-test-renderer';

import readmeRender from "../../application/views/readmeView";

configure({ adapter: new Adapter() });

describe("README header renders correctly", function() {
    it("equals with snapshot", function() {
        expect(
            renderer.create(<readmeRender/>)
                .toJSON()
        ).toMatchSnapshot();
    });
});
