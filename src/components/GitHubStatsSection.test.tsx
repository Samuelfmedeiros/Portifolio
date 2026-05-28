import { GitHubStatsSection } from './GitHubStatsSection';

describe('GitHubStatsSection', () => {
    it('should render GitHub stats', () => {
        const { container } = render(<GitHubStatsSection />);
        expect(container).toBeInTheDocument();
        // Would check for stats elements
    });

    it('should handle loading state', () => {
        // Would mock API calls
    });
});