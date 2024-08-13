const PanelConfigBuilder =
{
    buildGroup(name: string, nodes: number, title: string) {
        const rows = Number.parseInt(nodes / 2);
        const flag = nodes % 2 == 0;
        return {
            name,
            title,
            graphHeight: (flag ? rows : rows + 1) * 110,
        }
    }

}

export default PanelConfigBuilder;