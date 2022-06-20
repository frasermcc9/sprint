import { Layout, useScienceOnLoad } from "@sprint/components";

export default function Index() {
  const track = useScienceOnLoad("visit_goals");

  return <Layout.Page>Goals!</Layout.Page>;
}
