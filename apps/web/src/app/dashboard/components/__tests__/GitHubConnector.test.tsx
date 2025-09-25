/**
 * Unit tests for GitHubConnector component
 * Testing UI interactions, OAuth initiation, and disconnect functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GitHubConnector from '../GitHubConnector';

// Mock Supabase client
jest.mock('@/app/utils/supabase/client', () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      signInWithOAuth: jest.fn(),
      getUser: jest.fn(),
      unlinkIdentity: jest.fn()
    }
  })
}));

// Mock window.location
const mockLocation = {
  href: '',
  reload: jest.fn(),
  origin: 'http://localhost:3000'
};

// Delete existing location before defining
delete (window as any).location;
window.location = mockLocation as any;

// Mock fetch for disconnect functionality
global.fetch = jest.fn();

describe('GitHubConnector', () => {
  const defaultProps = {
    userId: 'test-user-id',
    isConnected: false
  };

  const mockSupabase = require('@/app/utils/supabase/client').createClient();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.href = '';
    mockLocation.reload.mockClear();
  });

  describe('when not connected', () => {
    it('should render connect button and not connected status', () => {
      render(<GitHubConnector {...defaultProps} />);

      expect(screen.getByText('GitHub')).toBeInTheDocument();
      expect(screen.getByText('Connect your repositories')).toBeInTheDocument();
      expect(screen.getByText('Not connected')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /connect github/i })).toBeInTheDocument();
      expect(screen.getByText('We\'ll request read-only access to your repositories')).toBeInTheDocument();
    });

    it('should initiate OAuth flow when connect button is clicked', async () => {
      mockSupabase.auth.signInWithOAuth.mockResolvedValue({
        data: { provider: 'github', url: 'https://github.com/login/oauth/authorize' },
        error: null
      });

      render(<GitHubConnector {...defaultProps} />);

      const connectButton = screen.getByRole('button', { name: /connect github/i });
      fireEvent.click(connectButton);

      await waitFor(() => {
        expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
          provider: 'github',
          options: {
            redirectTo: 'http://localhost:3000/api/auth/callback',
            scopes: 'repo:status public_repo'
          }
        });
      });
    });

    it('should handle OAuth initiation errors', async () => {
      mockSupabase.auth.signInWithOAuth.mockResolvedValue({
        data: null,
        error: new Error('OAuth failed')
      });

      render(<GitHubConnector {...defaultProps} />);

      const connectButton = screen.getByRole('button', { name: /connect github/i });
      fireEvent.click(connectButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to initiate GitHub connection. Please try again.')).toBeInTheDocument();
      });
    });
  });

  describe('when connected', () => {
    const connectedProps = {
      ...defaultProps,
      isConnected: true
    };

    it('should render disconnect button and connected status', () => {
      render(<GitHubConnector {...connectedProps} />);

      expect(screen.getByText('GitHub')).toBeInTheDocument();
      expect(screen.getByText('Connect your repositories')).toBeInTheDocument();
      expect(screen.getByText('Connected')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /disconnect github/i })).toBeInTheDocument();
      expect(screen.queryByText('We\'ll request read-only access to your repositories')).not.toBeInTheDocument();
    });

    it('should handle disconnect when button is clicked', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: {
          user: {
            id: 'test-user-id',
            identities: [{
              provider: 'github',
              id: 'github-identity-id',
              user_id: 'test-user-id',
              identity_id: 'identity-id'
            }]
          }
        },
        error: null
      });

      mockSupabase.auth.unlinkIdentity.mockResolvedValue({
        data: {},
        error: null
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });

      render(<GitHubConnector {...connectedProps} />);

      const disconnectButton = screen.getByRole('button', { name: /disconnect github/i });
      fireEvent.click(disconnectButton);

      await waitFor(() => {
        expect(mockSupabase.auth.getUser).toHaveBeenCalled();
        expect(mockSupabase.auth.unlinkIdentity).toHaveBeenCalled();
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/auth/github/disconnect',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          })
        );
      });

      expect(mockLocation.reload).toHaveBeenCalled();
    });

    it('should handle disconnect errors', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      render(<GitHubConnector {...connectedProps} />);

      const disconnectButton = screen.getByRole('button', { name: /disconnect github/i });
      fireEvent.click(disconnectButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to disconnect GitHub. Please try again.')).toBeInTheDocument();
      });
    });
  });

  describe('status chips', () => {
    it('should show success chip when connected', () => {
      render(<GitHubConnector {...defaultProps} isConnected={true} />);

      const chip = screen.getByText('Connected');
      expect(chip).toBeInTheDocument();
    });

    it('should show default chip when not connected', () => {
      render(<GitHubConnector {...defaultProps} isConnected={false} />);

      const chip = screen.getByText('Not connected');
      expect(chip).toBeInTheDocument();
    });
  });

  describe('error display', () => {
    it('should clear error when user retries connection', async () => {
      mockSupabase.auth.signInWithOAuth
        .mockResolvedValueOnce({
          data: null,
          error: new Error('First attempt failed')
        })
        .mockResolvedValueOnce({
          data: { provider: 'github', url: 'https://github.com/login/oauth/authorize' },
          error: null
        });

      render(<GitHubConnector {...defaultProps} />);

      const connectButton = screen.getByRole('button', { name: /connect github/i });
      fireEvent.click(connectButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to initiate GitHub connection. Please try again.')).toBeInTheDocument();
      });

      fireEvent.click(connectButton);

      await waitFor(() => {
        expect(screen.queryByText('Failed to initiate GitHub connection. Please try again.')).not.toBeInTheDocument();
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper aria labels and roles', () => {
      render(<GitHubConnector {...defaultProps} />);

      const button = screen.getByRole('button', { name: /connect github/i });
      expect(button).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      render(<GitHubConnector {...defaultProps} />);

      const button = screen.getByRole('button', { name: /connect github/i });
      expect(button).toHaveAttribute('type', 'button');
    });
  });
});