/**
 * Person Schema
 * Structured data for people (team members, owner, makeup artists)
 * Enhances knowledge graph and people-related search results
 */

import { Helmet } from 'react-helmet-async';
import { BUSINESS_CONFIG } from '@/config/business';

interface PersonSchemaProps {
  name: string;
  jobTitle: string;
  image?: string;
  bio?: string;
  sameAs?: string[]; // Social media profiles
  skills?: string[];
  yearsExperience?: number;
  awards?: string[];
  email?: string;
  telephone?: string;
  isFounder?: boolean;
}

const PersonSchema = ({
  name,
  jobTitle,
  image,
  bio,
  sameAs = [],
  skills = [],
  yearsExperience,
  awards = [],
  email,
  telephone,
  isFounder = false,
}: PersonSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name,
    jobTitle: jobTitle,
    ...(image && {
      image: `${BUSINESS_CONFIG.website.url}${image}`,
    }),
    ...(bio && {
      description: bio,
    }),
    worksFor: {
      '@type': 'Organization',
      name: BUSINESS_CONFIG.name,
      url: BUSINESS_CONFIG.website.url,
    },
    ...(sameAs.length > 0 && {
      sameAs: sameAs,
    }),
    ...(skills.length > 0 && {
      knowsAbout: skills,
    }),
    ...(yearsExperience && {
      yearsInPractice: yearsExperience,
    }),
    ...(awards.length > 0 && {
      award: awards,
    }),
    ...(email && {
      email: email,
    }),
    ...(telephone && {
      telephone: telephone,
    }),
    ...(isFounder && {
      founder: {
        '@type': 'Organization',
        name: BUSINESS_CONFIG.name,
      },
    }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_CONFIG.contact.address.street,
      addressLocality: BUSINESS_CONFIG.contact.address.city,
      addressRegion: BUSINESS_CONFIG.contact.address.state,
      postalCode: BUSINESS_CONFIG.contact.address.zip,
      addressCountry: 'US',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default PersonSchema;
