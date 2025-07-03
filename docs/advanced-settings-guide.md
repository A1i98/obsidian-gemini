# Advanced Settings Guide

This guide covers the advanced settings available in Gemini Scribe, including model parameter tuning, API configuration, and developer options.

## Accessing Advanced Settings

Advanced settings are hidden by default to keep the interface clean. To access them:

1. Open Obsidian Settings
2. Navigate to **Gemini Scribe** under Community plugins
3. Scroll down to the **Developer Settings** section
4. Click **Show Advanced Settings**

## Model Parameter Controls

### Temperature Settings

**Temperature** controls the randomness and creativity of AI responses:

- **Range**: 0 to 2.0 (dynamically adjusted based on available models)
- **Default**: 0.7
- **Lower values** (0.0-0.5): More deterministic, consistent responses
- **Higher values** (1.0-2.0): More creative, varied responses

**When to adjust:**
- Creative writing: Use higher temperature (1.0-1.5)
- Technical documentation: Use lower temperature (0.2-0.5)
- General chat: Default (0.7) works well

### Top P Settings

**Top P** controls the diversity of word choices the AI considers:

- **Range**: 0 to 1.0 (always fixed range for Gemini models)
- **Default**: Varies by model (typically 0.95-1.0)
- **Lower values** (0.1-0.5): More focused, predictable responses
- **Higher values** (0.8-1.0): More diverse, exploratory responses

**When to adjust:**
- Focused analysis: Use lower Top P (0.3-0.7)
- Brainstorming: Use higher Top P (0.9-1.0)
- Balanced responses: Use default values

### Dynamic Parameter Ranges

Gemini Scribe automatically discovers the parameter limits for your available models:

- **Temperature ranges** adapt to the maximum supported by your models
- **Model-specific limits** are enforced to prevent API errors
- **Real-time validation** adjusts values that exceed model capabilities
- **Informational displays** show the actual ranges and default values

## API Configuration

### API Provider

Choose which AI service to use:

- **Google Gemini (New SDK)**: Official Google AI SDK (recommended)
- **Ollama (Local)**: *Coming soon* - Local model support

### Retry Settings

Configure how the plugin handles API failures:

**Maximum Retries**
- **Default**: 3 attempts
- **Range**: 0-10 retries
- **Purpose**: Handles temporary network issues or API rate limits

**Initial Backoff Delay**
- **Default**: 1000ms (1 second)
- **Range**: 100-10000ms
- **Purpose**: Time to wait before first retry (uses exponential backoff)

**How retry works:**
1. First attempt fails
2. Wait initial delay (e.g., 1 second)
3. Second attempt fails
4. Wait double the delay (e.g., 2 seconds)
5. Third attempt fails
6. Wait quadruple the delay (e.g., 4 seconds)
7. Final attempt or success

## Model Discovery

### Dynamic Model Discovery

Automatically fetch available models from Google's API:

**Enable Dynamic Model Discovery**
- **Default**: Enabled
- **Purpose**: Keeps model list current with Google's latest releases
- **Updates**: Model parameter limits and availability

**Auto-update Interval**
- **Default**: 24 hours
- **Range**: 0-168 hours (7 days)
- **0 = Manual only**: Disable automatic updates

**Fallback to Static Models**
- **Default**: Enabled
- **Purpose**: Use built-in model list when API discovery fails
- **Recommended**: Keep enabled for reliability

### Discovery Status

Monitor and control model discovery:

**Status Indicators:**
- ✓ Working: Discovery successful, shows last update time
- ✗ Not working: Shows error details
- Model count: Number of models found

**Manual Refresh:**
- Click "Refresh models" to update immediately
- Useful when new models are released
- Shows success/failure status

## Performance Optimization

### Context Management

**Context Depth Settings:**
- **Depth 0**: Current note only (fastest)
- **Depth 1**: Current note + direct links
- **Depth 2**: Includes links of linked notes
- **Depth 3+**: Exponentially more content

**Optimization tips:**
- Start with depth 1 for most use cases
- Increase depth for complex research projects
- Monitor API usage and response times
- Use Flash models for faster responses

### Model Selection Strategy

**For Chat (Quality focused):**
- Primary: Gemini 1.5 Pro
- Alternative: Gemini 1.5 Flash (faster)

**For Completions (Speed focused):**
- Primary: Gemini 1.5 Flash-8B
- Alternative: Gemini 1.5 Flash

**For Summaries (Balanced):**
- Primary: Gemini 1.5 Flash
- Alternative: Gemini 1.5 Pro (more detailed)

## Best Practices

### Parameter Tuning

1. **Start with defaults** - They work well for most use cases
2. **Make incremental changes** - Adjust by 0.1-0.2 at a time
3. **Test with your content** - Different content types may need different settings
4. **Document your preferences** - Keep notes on what works for different tasks

### API Management

1. **Monitor usage** - Check Google AI Studio for API quota
2. **Use appropriate models** - Don't use Pro models for simple tasks
3. **Adjust retry settings** - More retries for unreliable connections
4. **Enable fallback models** - Ensures continued functionality

### Model Discovery

1. **Keep discovery enabled** - Stay current with new releases
2. **Use manual refresh** - When you know new models are available
3. **Monitor discovery status** - Check for API key or connection issues
4. **Update regularly** - Enable auto-updates for convenience

## Troubleshooting

### Parameter Issues

**Temperature/Top P not taking effect:**
- Check if model supports the parameter range
- Verify settings are saved (restart Obsidian if needed)
- Look for validation warnings in notices

**Extreme responses:**
- Lower temperature if too random
- Adjust Top P if responses are too narrow/broad
- Reset to defaults if unsure

### API Problems

**Frequent failures:**
- Increase retry count
- Extend initial backoff delay
- Check API key permissions
- Verify internet connection

**Slow responses:**
- Reduce context depth
- Use faster models (Flash variants)
- Lower retry count for quicker failures

### Model Discovery Issues

**Discovery failing:**
- Check API key validity
- Verify network connectivity
- Try manual refresh
- Enable fallback to static models

**Models not updating:**
- Check auto-update interval
- Force refresh manually
- Clear plugin cache (restart Obsidian)
- Verify API key permissions

## Security Considerations

### API Key Protection

- **Never share** your API key
- **Use environment variables** for development
- **Rotate keys regularly** as a security practice
- **Monitor usage** for unauthorized access

### Data Privacy

- **Direct API calls** - Data goes only to Google
- **Local storage** - Chat history stays in your vault
- **No third parties** - No intermediate servers involved
- **Encryption** - Consider vault encryption for sensitive data

### Safe Settings

- **Review parameter changes** - Extreme values may produce unexpected results
- **Test with non-sensitive data** - Before using on important content
- **Backup regularly** - Especially when experimenting with settings
- **Use version control** - Track changes to your vault

## Advanced Use Cases

### Research Projects

```
Temperature: 0.3-0.5 (focused analysis)
Top P: 0.7-0.9 (balanced diversity)
Context Depth: 2-3 (comprehensive context)
Model: Gemini 1.5 Pro (best quality)
```

### Creative Writing

```
Temperature: 1.0-1.5 (high creativity)
Top P: 0.9-1.0 (maximum diversity)
Context Depth: 1-2 (relevant context)
Model: Gemini 1.5 Pro (best quality)
```

### Technical Documentation

```
Temperature: 0.2-0.4 (consistent style)
Top P: 0.5-0.8 (focused responses)
Context Depth: 1-2 (relevant context)
Model: Gemini 1.5 Flash (fast, accurate)
```

### Brainstorming Sessions

```
Temperature: 1.2-1.8 (maximum creativity)
Top P: 0.9-1.0 (diverse ideas)
Context Depth: 1-2 (some context)
Model: Gemini 1.5 Pro (creative capability)
```

## Support

For issues with advanced settings:

1. **Check the troubleshooting section** above
2. **Review the main documentation** for basic setup
3. **Report bugs** on [GitHub Issues](https://github.com/allenhutchison/obsidian-gemini/issues)
4. **Join the discussion** in the Obsidian community

---

*Advanced settings provide powerful control over AI behavior. Start conservative and adjust based on your specific needs and content.*