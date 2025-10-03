import { Button } from "../Button";

export default function AdminPanel() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      
      <div className="bg-white border rounded-xl shadow p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Administrativne Akcije</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            buttonStyle="btn--primary"
            buttonSize="btn--large"
            link="/upload"
            className="flex-1 text-center min-w-[200px]"
          >
            📤 Upload Epizoda
          </Button>
          <Button 
            buttonStyle="btn--primary"
            buttonSize="btn--large"
            link="/add-guest"
            className="flex-1 text-center min-w-[200px]"
          >
            👥 Dodaj Gosta
          </Button>
        </div>
        
        <div className="mt-6 text-center text-gray-600">
          <p>Odaberite akciju koju želite da izvršite</p>
        </div>
      </div>
    </div>
  );
}