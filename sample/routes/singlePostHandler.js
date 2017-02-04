import ReactDOMServer from 'react-dom/server';
import path from "path";
import React from "react";
import {requireUncached} from "../../app/utils";
import {templatePath} from "../index";

const singlePostHandler = {
  async handlesArguments({project}) {
    const posts = await project.metaOf({id: "posts"});
    return {
      posts: posts.children
    };
  },
  async handles({posts}) {
    return posts.map(p => `/${p.split("@")[1]}`);
  },
  async handle({project, url}) {
    const id = url.substr(1);
    const content = await project.valueOf({id: `post@${id}`});

    const Template = requireUncached(path.join(process.cwd(), templatePath, "template")).template;
    const str = ReactDOMServer.renderToStaticMarkup(<Template content={id + content} />);

    return {
      headers: [],
      body: str
    }
  }
};
export {singlePostHandler};
