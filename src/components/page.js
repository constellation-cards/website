import React from "react"
import Layout from "./layout"
import SEO from "./seo"

const Page = ({ children, pageContext }) => (
  <Layout>
    <SEO {...pageContext.frontmatter} />
    {children}
  </Layout>
)

export default Page
