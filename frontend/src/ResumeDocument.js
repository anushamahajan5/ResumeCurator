import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register a font if you want to use custom fonts, otherwise default will be used.
// For example, to use a Google Font:
// Font.register({
//   family: 'Open Sans',
//   fonts: [
//     { src: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf' },
//     { src: 'https://fonts.gstatic.com/s/opensans/v17/mem5YaGs126MiZpBA-UNirk.ttf', fontWeight: 600 },
//   ],
// });

// Create styles for the document
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica', // Default font
  },
  section: {
    marginBottom: 15,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 18,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 5,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 10,
    marginBottom: 3,
  },
  bulletPoint: {
    fontSize: 10,
    marginBottom: 3,
    marginLeft: 10,
  },
  experienceItem: {
    marginBottom: 10,
  },
  experienceTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  experienceCompany: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  experienceDates: {
    fontSize: 10,
    color: '#555',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  skillTag: {
    fontSize: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginRight: 5,
    marginBottom: 5,
  },
});

// Create Document Component
const ResumeDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Name */}
      <View style={styles.section}>
        <Text style={styles.header}>{data.name || 'Applicant Name'}</Text>
      </View>

      {/* Summary */}
      {data.summary && (
        <View style={styles.section}>
          <Text style={styles.subheader}>Summary</Text>
          <Text style={styles.text}>{data.summary}</Text>
        </View>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subheader}>Experience</Text>
          {data.experience.map((exp, index) => (
            <View key={index} style={styles.experienceItem}>
              <Text style={styles.experienceTitle}>{exp.title}</Text>
              <Text style={styles.experienceCompany}>{exp.company}</Text>
              <Text style={styles.experienceDates}>{exp.dates}</Text>
              {exp.description && exp.description.split('\n').map((desc, descIndex) => (
                desc.trim() && <Text key={descIndex} style={styles.bulletPoint}>• {desc.trim()}</Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subheader}>Education</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={styles.experienceItem}>
              <Text style={styles.experienceTitle}>{edu.degree}</Text>
              <Text style={styles.experienceCompany}>{edu.institution}</Text>
              <Text style={styles.experienceDates}>{edu.dates}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subheader}>Skills</Text>
          <View style={styles.skillsContainer}>
            {data.skills.map((skill, index) => (
              <Text key={index} style={styles.skillTag}>{skill}</Text>
            ))}
          </View>
        </View>
      )}

      {/* Note: skills_gap is for display on the web, not typically included in the resume PDF itself.
          If you wanted to include it, you'd add another section here. */}

    </Page>
  </Document>
);

export default ResumeDocument;