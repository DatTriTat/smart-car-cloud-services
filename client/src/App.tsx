import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";

export default function App() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Smart Car Cloud</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Fontend skeleton is ready</p>
          <Button>Test Button</Button>
        </CardContent>
      </Card>
    </div>
  );
}
