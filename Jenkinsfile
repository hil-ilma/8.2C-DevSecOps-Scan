pipeline {
  agent any
  stages {
    stage('Checkout') { /* … */ }
    stage('Install Dependencies') { /* … */ }
    stage('Run Tests') { /* … */ }
    stage('Generate Coverage Report') { /* … */ }
    stage('NPM Audit (Security Scan)') {
      steps {
        sh 'npm audit --audit-level=moderate || true'
      }
      post {
        success {
          emailext(
            subject: " Security Scan PASSED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: """<p>Your security scan completed successfully.</p>
                     <p>See console output here: ${env.BUILD_URL}console</p>""",
            attachLog: true,
            recipientProviders: [[$class: 'DevelopersRecipientProvider']]
          )
        }
        failure {
          emailext(
            subject: " Security Scan FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: """<p>The security scan failed. Please investigate.</p>
                     <p>See console output here: ${env.BUILD_URL}console</p>""",
            attachLog: true,
            recipientProviders: [[$class: 'DevelopersRecipientProvider']]
          )
        }
      }
    }
  }
}
