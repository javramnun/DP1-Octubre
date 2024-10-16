import AppNavbar from "./AppNavbar";
import { render, screen } from "./test-utils";

describe('AppNavbar', () => {

    test('renders public links correctly', () => {
        render(<AppNavbar />);
        const linkDocsElement = screen.getByRole('link', { name: 'Docs' });
        expect(linkDocsElement).toBeInTheDocument();

        const linkHomeElement = screen.getByRole('link', { name: 'logo PetClinic' });
        expect(linkHomeElement).toBeInTheDocument();
    });

    test('renders not user links correctly', () => {
        render(<AppNavbar />);
        const linkDocsElement = screen.getByRole('link', { name: 'Register' });
        expect(linkDocsElement).toBeInTheDocument();                                
    });

});
